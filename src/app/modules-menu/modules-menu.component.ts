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
  @Output() moduleReset = new EventEmitter<{ moduleId: string; index: number }>();

  showLevelModal = false;
  selectedLevel: 'Iniciante' | 'Intermediário' | 'Avançado' | null = null;

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

  getModuleScore(moduleId: string): number {
    const progress = this.getModuleProgress(moduleId);
    return progress?.score || 0;
  }

  onResetModule(event: Event, moduleId: string, index: number): void {
    // Stop propagation to prevent module selection
    event.stopPropagation();

    const progress = this.getModuleProgress(moduleId);
    if (!progress) return;

    const confirmMsg = `Tem certeza que deseja reiniciar "${this.modules[index].title}"?\n\n` +
                       `Progresso atual:\n` +
                       `- ${progress.answeredQuestions} questões respondidas\n` +
                       `- ${progress.score} pontos\n` +
                       `- ${progress.correctAnswers} respostas corretas\n\n` +
                       `Todo o progresso será perdido!`;

    if (confirm(confirmMsg)) {
      this.progressService.resetModule(moduleId);
      console.log(`[ModulesMenu] Module ${moduleId} reset`);

      // If this is the active module, emit event to reload it
      if (index === this.activeIndex) {
        this.moduleReset.emit({ moduleId, index });
      }
    }
  }

  openLevelModal(level: 'Iniciante' | 'Intermediário' | 'Avançado'): void {
    this.selectedLevel = level;
    this.showLevelModal = true;
  }

  closeLevelModal(): void {
    this.showLevelModal = false;
    this.selectedLevel = null;
  }

  getFilteredModules(): ConversationModule[] {
    if (!this.selectedLevel) return [];
    return this.modules.filter(m => m.level === this.selectedLevel);
  }

  getLevelLabel(level: 'Iniciante' | 'Intermediário' | 'Avançado' | null): string {
    switch (level) {
      case 'Iniciante': return 'Beginner';
      case 'Intermediário': return 'Intermediate';
      case 'Avançado': return 'Advanced';
      default: return '';
    }
  }

  getModuleIndex(module: ConversationModule): number {
    return this.modules.findIndex(m => m.id === module.id);
  }

  getCurrentModule(): ConversationModule | null {
    if (this.activeIndex >= 0 && this.activeIndex < this.modules.length) {
      return this.modules[this.activeIndex];
    }
    return null;
  }

  selectModuleFromModal(module: ConversationModule, modalIndex: number): void {
    const actualIndex = this.getModuleIndex(module);
    if (actualIndex !== -1) {
      this.select.emit(actualIndex);
      this.closeLevelModal();
    }
  }

  onResetModuleFromModal(event: Event, moduleId: string, index: number): void {
    // Stop propagation to prevent module selection
    event.stopPropagation();

    const progress = this.getModuleProgress(moduleId);
    if (!progress) return;

    const module = this.modules[index];
    const confirmMsg = `Tem certeza que deseja reiniciar "${module.title}"?\n\n` +
                       `Progresso atual:\n` +
                       `- ${progress.answeredQuestions} questões respondidas\n` +
                       `- ${progress.score} pontos\n` +
                       `- ${progress.correctAnswers} respostas corretas\n\n` +
                       `Todo o progresso será perdido!`;

    if (confirm(confirmMsg)) {
      this.progressService.resetModule(moduleId);
      console.log(`[ModulesMenu] Module ${moduleId} reset from modal`);

      // If this is the active module, emit event to reload it
      if (index === this.activeIndex) {
        this.moduleReset.emit({ moduleId, index });
      }
    }
  }
}
