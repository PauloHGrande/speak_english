
import { Component } from '@angular/core';
import { VoiceService } from './voice.service';
import { ConversationModule } from './modules-menu/modules-menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
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

  constructor(private voice: VoiceService) {}

  async onSelectModule(index: number) {
    this.activeIndex = index;
    const id = this.modules[index].id;
    await this.voice.loadModuleFromJson(id);
  }
}
