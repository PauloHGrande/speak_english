
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ConversationModule = {
  id: string;
 title: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  lessons: number;
  duration: string;
};

@Component({
  selector: 'app-modules-menu',
  templateUrl: './modules-menu.component.html',
  styleUrls: ['./modules-menu.component.css'],
})
export class ModulesMenuComponent {
  @Input() modules: ConversationModule[] = [];
  @Input() activeIndex = 0;
  @Output() select = new EventEmitter<number>();

  onSelect(index: number) {
    if (index === this.activeIndex) return;
    this.select.emit(index);
  }

  trackById(_idx: number, m: ConversationModule) {
    return m.id;
  }
}
