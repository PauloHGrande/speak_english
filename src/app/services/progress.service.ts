import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SessionActivity {
  date: string;
  questionsAnswered: number;
  correctAnswers: number;
  timeSpent?: number;
}

export interface ModuleProgress {
  moduleId: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  score: number;
  completedDate?: string;
  lastAccessDate: string;
  sessions: SessionActivity[];
}

export interface UserProgress {
  userId: number;
  modules: { [moduleId: string]: ModuleProgress };
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progressSubject: BehaviorSubject<UserProgress | null>;
  public progress$: Observable<UserProgress | null>;

  constructor() {
    this.progressSubject = new BehaviorSubject<UserProgress | null>(null);
    this.progress$ = this.progressSubject.asObservable();
  }

  loadUserProgress(userId: number): void {
    const key = `user_progress_${userId}`;
    const stored = localStorage.getItem(key);

    if (stored) {
      const progress = JSON.parse(stored);

      // Migrate old data without score field
      Object.keys(progress.modules || {}).forEach(moduleId => {
        if (progress.modules[moduleId].score === undefined) {
          progress.modules[moduleId].score = 0;
        }
      });

      this.progressSubject.next(progress);
      this.saveProgress(progress); // Save migrated data
    } else {
      const newProgress: UserProgress = {
        userId,
        modules: {}
      };
      this.progressSubject.next(newProgress);
      this.saveProgress(newProgress);
    }
  }

  private saveProgress(progress: UserProgress): void {
    const key = `user_progress_${progress.userId}`;
    localStorage.setItem(key, JSON.stringify(progress));
    this.progressSubject.next(progress);
    console.log(`[ProgressService] Progress saved and broadcast to subscribers`);
  }

  getModuleProgress(moduleId: string): ModuleProgress | null {
    const progress = this.progressSubject.value;
    if (!progress) return null;
    return progress.modules[moduleId] || null;
  }

  initializeModule(moduleId: string, totalQuestions: number): void {
    const progress = this.progressSubject.value;
    if (!progress) return;

    if (!progress.modules[moduleId]) {
      progress.modules[moduleId] = {
        moduleId,
        totalQuestions,
        answeredQuestions: 0,
        correctAnswers: 0,
        score: 0,
        lastAccessDate: this.getTodayDate(),
        sessions: []
      };
      this.saveProgress(progress);
    } else {
      // Update last access date
      progress.modules[moduleId].lastAccessDate = this.getTodayDate();
      this.saveProgress(progress);
    }
  }

  recordAnswer(moduleId: string, isCorrect: boolean, points: number = 10): void {
    const progress = this.progressSubject.value;
    if (!progress || !progress.modules[moduleId]) return;

    const moduleProgress = progress.modules[moduleId];
    const today = this.getTodayDate();

    // Update module progress
    moduleProgress.answeredQuestions++;
    if (isCorrect) {
      moduleProgress.correctAnswers++;
      moduleProgress.score += points;
    }

    console.log(`[ProgressService] Module ${moduleId}: answered=${moduleProgress.answeredQuestions}/${moduleProgress.totalQuestions}, score=${moduleProgress.score}, correct=${moduleProgress.correctAnswers}`);

    // Check if module is completed
    if (moduleProgress.answeredQuestions >= moduleProgress.totalQuestions && !moduleProgress.completedDate) {
      moduleProgress.completedDate = today;
      console.log(`[ProgressService] Module ${moduleId} completed!`);
    }

    // Update today's session
    let todaySession = moduleProgress.sessions.find(s => s.date === today);
    if (!todaySession) {
      todaySession = {
        date: today,
        questionsAnswered: 0,
        correctAnswers: 0
      };
      moduleProgress.sessions.push(todaySession);
    }

    todaySession.questionsAnswered++;
    if (isCorrect) {
      todaySession.correctAnswers++;
    }

    this.saveProgress(progress);
  }

  resetModule(moduleId: string): void {
    const progress = this.progressSubject.value;
    if (!progress || !progress.modules[moduleId]) return;

    const moduleProgress = progress.modules[moduleId];
    const today = this.getTodayDate();

    // Reset module progress
    moduleProgress.answeredQuestions = 0;
    moduleProgress.correctAnswers = 0;
    moduleProgress.score = 0;
    moduleProgress.completedDate = undefined;
    moduleProgress.lastAccessDate = today;

    // Clear today's session to update Today's Progress
    const todaySessionIndex = moduleProgress.sessions.findIndex(s => s.date === today);
    if (todaySessionIndex !== -1) {
      moduleProgress.sessions.splice(todaySessionIndex, 1);
      console.log(`[ProgressService] Cleared today's session for module ${moduleId}`);
    }

    console.log(`[ProgressService] Module ${moduleId} reset successfully`);
    this.saveProgress(progress);
  }

  getModuleScore(moduleId: string): number {
    const progress = this.progressSubject.value;
    if (!progress || !progress.modules[moduleId]) return 0;
    return progress.modules[moduleId].score;
  }

  getTodayActivity(): { moduleId: string; activity: SessionActivity }[] {
    const progress = this.progressSubject.value;
    if (!progress) return [];

    const today = this.getTodayDate();
    const activities: { moduleId: string; activity: SessionActivity }[] = [];

    Object.keys(progress.modules).forEach(moduleId => {
      const moduleProgress = progress.modules[moduleId];
      const todaySession = moduleProgress.sessions.find(s => s.date === today);
      if (todaySession) {
        activities.push({ moduleId, activity: todaySession });
      }
    });

    return activities;
  }

  getActivityForDate(date: string): { moduleId: string; activity: SessionActivity }[] {
    const progress = this.progressSubject.value;
    if (!progress) return [];

    const activities: { moduleId: string; activity: SessionActivity }[] = [];

    Object.keys(progress.modules).forEach(moduleId => {
      const moduleProgress = progress.modules[moduleId];
      const session = moduleProgress.sessions.find(s => s.date === date);
      if (session) {
        activities.push({ moduleId, activity: session });
      }
    });

    return activities;
  }

  getAllActivityDates(): Map<string, { questionsAnswered: number; correctAnswers: number }> {
    const progress = this.progressSubject.value;
    if (!progress) return new Map();

    const dateMap = new Map<string, { questionsAnswered: number; correctAnswers: number }>();

    Object.keys(progress.modules).forEach(moduleId => {
      const moduleProgress = progress.modules[moduleId];
      moduleProgress.sessions.forEach(session => {
        const existing = dateMap.get(session.date);
        if (existing) {
          existing.questionsAnswered += session.questionsAnswered;
          existing.correctAnswers += session.correctAnswers;
        } else {
          dateMap.set(session.date, {
            questionsAnswered: session.questionsAnswered,
            correctAnswers: session.correctAnswers
          });
        }
      });
    });

    return dateMap;
  }

  getSessionHistory(moduleId: string): SessionActivity[] {
    const progress = this.progressSubject.value;
    if (!progress || !progress.modules[moduleId]) return [];
    return progress.modules[moduleId].sessions;
  }

  private getTodayDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  clearUserProgress(userId: number): void {
    const key = `user_progress_${userId}`;
    localStorage.removeItem(key);
    this.progressSubject.next(null);
  }

  // Debug method to log current progress state
  debugProgress(moduleId?: string): void {
    const progress = this.progressSubject.value;
    if (!progress) {
      console.log('[ProgressService] No progress data loaded');
      return;
    }

    if (moduleId) {
      const moduleProgress = progress.modules[moduleId];
      if (moduleProgress) {
        console.log(`[ProgressService] Module: ${moduleId}`);
        console.log(`  Total Questions: ${moduleProgress.totalQuestions}`);
        console.log(`  Answered: ${moduleProgress.answeredQuestions}`);
        console.log(`  Correct: ${moduleProgress.correctAnswers}`);
        console.log(`  Score: ${moduleProgress.score}`);
        console.log(`  Accuracy: ${Math.round((moduleProgress.correctAnswers / moduleProgress.answeredQuestions) * 100)}%`);
        console.log(`  Sessions:`, moduleProgress.sessions);
      } else {
        console.log(`[ProgressService] No progress for module: ${moduleId}`);
      }
    } else {
      console.log('[ProgressService] All modules:');
      Object.keys(progress.modules).forEach(mid => {
        const mp = progress.modules[mid];
        console.log(`  ${mid}: ${mp.answeredQuestions}/${mp.totalQuestions} (${mp.score} points)`);
      });
    }
  }
}
