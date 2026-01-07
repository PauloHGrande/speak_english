import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ProgressService, SessionActivity } from '../services/progress.service';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';

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
export class SessionHistoryComponent implements OnInit, OnDestroy, OnChanges {
  @Input() externalSelectedDate: Date | null = null;
  @Output() dateSelected = new EventEmitter<Date>();

  todayActivities: TodayActivity[] = [];
  showHistory = true;
  showCalendar = true;
  selectedDate: Date | null = null;
  activityDates: Map<string, { questionsAnswered: number; correctAnswers: number }> = new Map();
  private progressSubscription?: Subscription;

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
    this.selectedDate = this.externalSelectedDate || new Date();
    this.loadActivities();

    // Subscribe to progress changes
    this.progressSubscription = this.progressService.progress$.subscribe(() => {
      this.loadActivities();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['externalSelectedDate'] && changes['externalSelectedDate'].currentValue) {
      this.selectedDate = changes['externalSelectedDate'].currentValue;
      this.loadActivitiesForDate(this.selectedDate);
    }
  }

  ngOnDestroy(): void {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  }

  loadActivities(): void {
    this.activityDates = this.progressService.getAllActivityDates();
    this.loadActivitiesForDate(this.selectedDate || new Date());
    console.log(`[SessionHistory] Activities loaded: ${this.todayActivities.length} modules with activity`);
  }

  loadActivitiesForDate(date: Date): void {
    const dateStr = this.formatDate(date);
    const activities = this.progressService.getActivityForDate(dateStr);
    this.todayActivities = activities.map(({ moduleId, activity }) => ({
      moduleId,
      moduleTitle: this.moduleTitles[moduleId] || moduleId,
      questionsAnswered: activity.questionsAnswered,
      correctAnswers: activity.correctAnswers,
      accuracy: Math.round((activity.correctAnswers / activity.questionsAnswered) * 100)
    }));
    console.log(`[SessionHistory] Loaded activities for ${dateStr}:`, this.todayActivities);
  }

  onDateSelected(date: Date | null): void {
    if (date) {
      this.selectedDate = date;
      this.loadActivitiesForDate(date);
      this.dateSelected.emit(date);
    }
  }

  toggleHistory(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showHistory = !this.showHistory;
  }

  toggleCalendar(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showCalendar = !this.showCalendar;
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

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.formatDate(date) === this.formatDate(today);
  }

  getSelectedDateLabel(): string {
    if (!this.selectedDate) return 'Today\'s Progress';
    if (this.isToday(this.selectedDate)) return 'Today\'s Progress';

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return this.selectedDate.toLocaleDateString('en-US', options);
  }

  // Custom date cell class function for calendar
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const dateStr = this.formatDate(cellDate);
      const activity = this.activityDates.get(dateStr);

      if (activity) {
        const accuracy = (activity.correctAnswers / activity.questionsAnswered) * 100;
        if (accuracy >= 80) {
          return 'high-accuracy-date';
        } else {
          return 'medium-accuracy-date';
        }
      }
    }
    return '';
  };

  getDateActivityInfo(date: Date): string {
    const dateStr = this.formatDate(date);
    const activity = this.activityDates.get(dateStr);
    if (activity) {
      return `${activity.questionsAnswered} questions`;
    }
    return '';
  }

  getDateActivity(date: Date): number | null {
    const dateStr = this.formatDate(date);
    const activity = this.activityDates.get(dateStr);
    return activity ? activity.questionsAnswered : null;
  }
}
