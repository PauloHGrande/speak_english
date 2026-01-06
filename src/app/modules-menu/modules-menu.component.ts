import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProgressService, ModuleProgress } from '../services/progress.service';

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

  constructor(public progressService: ProgressService) {}

  onSelect(index: number) {
    if (index === this.activeIndex) return;
    this.select.emit(index);
  }

  trackById(_idx: number, m: ConversationModule) {
    return m.id;
  }

  getModuleProgress(moduleId: string): ModuleProgress | null {
    return this.progressService.getModuleProgress(moduleId);
  }

  getProgressPercentage(moduleId: string): number {
    const progress = this.getModuleProgress(moduleId);
    if (!progress || progress.totalQuestions === 0) return 0;
    return Math.round((progress.answeredQuestions / progress.totalQuestions) * 100);
  }

  isModuleCompleted(moduleId: string): boolean {
    const progress = this.getModuleProgress(moduleId);
    return progress?.completedDate !== undefined;
  }

  getRemainingQuestions(moduleId: string): number {
    const progress = this.getModuleProgress(moduleId);
    if (!progress) return 0;
    return Math.max(0, progress.totalQuestions - progress.answeredQuestions);
  }
}
