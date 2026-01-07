import { Component, OnInit } from '@angular/core';
import { VoiceService } from '../voice.service';
import { ConversationModule } from '../modules-menu/modules-menu.component';
import { AuthService } from '../services/auth.service';
import { ProgressService } from '../services/progress.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  modules: ConversationModule[] = [
    { id: 'greetings',      title: 'Greetings & Introductions', description: 'Basic greetings and introductions.',     level: 'Iniciante',     lessons: 15, duration: '20 min' },
    { id: 'daily-routines', title: 'Daily Routines',            description: 'Talk about your daily activities.',      level: 'Iniciante',     lessons: 15, duration: '20 min' },
    { id: 'family-friends', title: 'Family & Friends',          description: 'Discuss family and friendships.',        level: 'Iniciante',     lessons: 15, duration: '20 min' },
    { id: 'shopping',       title: 'Shopping & Money',          description: 'Shopping, prices, and payments.',        level: 'Iniciante',     lessons: 15, duration: '20 min' },
    { id: 'restaurant',     title: 'Food & Dining',             description: 'Ordering food and dining out.',          level: 'Iniciante',     lessons: 15, duration: '20 min' },
    { id: 'weather-time',   title: 'Weather & Time',            description: 'Talk about weather and time.',           level: 'Iniciante',     lessons: 15, duration: '20 min' },
    { id: 'directions',     title: 'Directions & Places',       description: 'Ask for and give directions.',           level: 'Intermediário', lessons: 15, duration: '20 min' },
    { id: 'hobbies',        title: 'Hobbies & Interests',       description: 'Discuss hobbies and free time.',         level: 'Intermediário', lessons: 15, duration: '20 min' },
    { id: 'work-school',    title: 'Work & School',             description: 'Talk about work and education.',         level: 'Intermediário', lessons: 15, duration: '20 min' },
    { id: 'travel',         title: 'Travel & Transportation',   description: 'Airport, hotels, and transportation.',   level: 'Intermediário', lessons: 15, duration: '20 min' },
    { id: 'smalltalk',      title: 'Small Talk & Conversation', description: 'Casual conversation and chitchat.',      level: 'Intermediário', lessons: 15, duration: '20 min' },
  ];

  activeIndex = 0;
  currentUser$;

  // Modal state
  showCalendarModal = false;
  showHistoryModal = false;
  selectedProgressDate: Date = new Date();

  constructor(
    private voice: VoiceService,
    private authService: AuthService,
    private progressService: ProgressService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(): void {
    // Load user progress when component initializes
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.progressService.loadUserProgress(currentUser.id);
    }
  }

  async onSelectModule(index: number) {
    this.activeIndex = index;
    const id = this.modules[index].id;
    await this.voice.loadModuleFromJson(id);
  }

  async onModuleReset(event: { moduleId: string; index: number }) {
    console.log(`[Home] Module reset: ${event.moduleId}, reloading...`);
    // Reload the module to reflect the reset state
    await this.voice.loadModuleFromJson(event.moduleId);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onProgressDateSelected(date: Date): void {
    this.selectedProgressDate = date;
  }

  getProgressDateLabel(): string {
    if (!this.selectedProgressDate) return 'Today\'s Progress';

    const today = new Date();
    const selectedDateStr = this.selectedProgressDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    if (selectedDateStr === todayStr) {
      return 'Today\'s Progress';
    }

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    };
    return this.selectedProgressDate.toLocaleDateString('en-US', options);
  }
}
