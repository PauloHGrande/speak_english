import { Component, OnInit } from '@angular/core';
import { ProgressService, SessionActivity } from '../services/progress.service';

interface TodayActivity {
  moduleId: string;
  moduleTitle: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
}

@Component({
  selector: 'app-session-history',
  templateUrl: './session-history.component.html',
  styleUrls: ['./session-history.component.css']
})
export class SessionHistoryComponent implements OnInit {
  todayActivities: TodayActivity[] = [];
  showHistory = false;

  // Module titles mapping
  private moduleTitles: { [key: string]: string } = {
    'greetings': 'Greetings & Introductions',
    'daily-routines': 'Daily Routines',
    'family-friends': 'Family & Friends',
    'shopping': 'Shopping & Money',
    'restaurant': 'Food & Dining',
    'weather-time': 'Weather & Time',
    'directions': 'Directions & Places',
    'hobbies': 'Hobbies & Interests',
    'work-school': 'Work & School',
    'travel': 'Travel & Transportation',
    'smalltalk': 'Small Talk & Conversation'
  };

  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    this.loadTodayActivities();
  }

  loadTodayActivities(): void {
    const activities = this.progressService.getTodayActivity();
    this.todayActivities = activities.map(({ moduleId, activity }) => ({
      moduleId,
      moduleTitle: this.moduleTitles[moduleId] || moduleId,
      questionsAnswered: activity.questionsAnswered,
      correctAnswers: activity.correctAnswers,
      accuracy: Math.round((activity.correctAnswers / activity.questionsAnswered) * 100)
    }));
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  getTotalQuestionsToday(): number {
    return this.todayActivities.reduce((sum, act) => sum + act.questionsAnswered, 0);
  }

  getTotalCorrectToday(): number {
    return this.todayActivities.reduce((sum, act) => sum + act.correctAnswers, 0);
  }

  getOverallAccuracy(): number {
    const total = this.getTotalQuestionsToday();
    const correct = this.getTotalCorrectToday();
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }
}
