
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
    { id: 'greetings',  title: 'Cumprimentos',   description: 'Apresentações e saudações básicas.', level: 'Iniciante',     lessons: 6,  duration: '10 min' },
    { id: 'restaurant', title: 'No Restaurante', description: 'Pedidos, cardápio e conta.',         level: 'Iniciante',     lessons: 8,  duration: '12 min' },
    { id: 'travel',     title: 'Viagem',         description: 'Aeroporto, hotel e passeios.',       level: 'Intermediário', lessons: 10, duration: '15 min' },
    { id: 'smalltalk',  title: 'Small Talk',     description: 'Conversa casual e interesses.',      level: 'Intermediário', lessons: 7,  duration: '12 min' },
    { id: 'smalltalk',  title: 'Small Talk',     description: 'Conversa casual e interesses.',      level: 'Intermediário', lessons: 7,  duration: '12 min' },
    { id: 'smalltalk',  title: 'Small Talk',     description: 'Conversa casual e interesses.',      level: 'Intermediário', lessons: 7,  duration: '12 min' },
    { id: 'smalltalk',  title: 'Small Talk',     description: 'Conversa casual e interesses.',      level: 'Intermediário', lessons: 7,  duration: '12 min' },
    { id: 'smalltalk',  title: 'Small Talk',     description: 'Conversa casual e interesses.',      level: 'Intermediário', lessons: 7,  duration: '12 min' },
    { id: 'smalltalk',  title: 'Small Talk',     description: 'Conversa casual e interesses.',      level: 'Intermediário', lessons: 7,  duration: '12 min' },
  ];

  activeIndex = 0;

  constructor(private voice: VoiceService) {}

  async onSelectModule(index: number) {
    this.activeIndex = index;
    const id = this.modules[index].id;
    await this.voice.loadModuleFromJson(id);
  }
}
