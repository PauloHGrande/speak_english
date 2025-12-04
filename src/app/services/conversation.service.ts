import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConversationModule } from '../models/conversation-module.model';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private basePath = 'assets/modules/';

  constructor(private http: HttpClient) {}

  getModule(moduleId: string): Observable<ConversationModule> {
    return this.http.get<ConversationModule>(`${this.basePath}${moduleId}.json`);
  }

  validateAnswer(userInput: string, expected: { answers: string[], alternatives?: string[] }): boolean {
    const normalize = (text: string) => text
      .toLowerCase()
      .replace(/[^a-z\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    const input = normalize(userInput);
    const answers = expected.answers.map(normalize);
    const alts = (expected.alternatives || []).map(normalize);
    return answers.includes(input) || alts.includes(input);
  }
}
