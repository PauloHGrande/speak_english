
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Dialog {
  question: string;
  translation: string;
  answer: string;
}

@Injectable({ providedIn: 'root' })
export class VoiceService {
  private modules: Dialog[] = [];
  private index = 0;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  constructor(private http: HttpClient) {
    speechSynthesis.onvoiceschanged = () => {
      this.pickEnglishFemaleVoice();
    };
    this.pickEnglishFemaleVoice();
  }

  async loadModules() {
    if (this.modules.length) return;
    this.modules = await this.http.get<Dialog[]>('modules.json').toPromise();
  }

  getNextDialog(): Dialog | null {
    if (this.index < this.modules.length) {
      return this.modules[this.index++];
    }
    return null;
  }

  startRecognition(callback: (text: string) => void) {
    const SR: any =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SR) {
      console.warn('Web Speech API não suportada');
      return;
    }

    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      console.log('Reconhecido:', text);
      callback(text);
    };

    recognition.start();
  }

  speak(
    text: string,
    handlers?: {
      onstart?: () => void;
      onboundary?: () => void;
      onend?: () => void;
    }
  ) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';

    if (this.preferredVoice) utter.voice = this.preferredVoice;
    if (handlers?.onstart) utter.onstart = handlers.onstart;
    if (handlers?.onboundary) utter.onboundary = handlers.onboundary;
    if (handlers?.onend) utter.onend = handlers.onend;

    speechSynthesis.speak(utter);
  }

  private pickEnglishFemaleVoice() {
    try {
      const voices = speechSynthesis.getVoices();
      const candidates = voices.filter((v) =>
        (v.lang || '').toLowerCase().startsWith('en')
      );

      const preferredNames = [
        'Google UK English Female',
        'Google US English',
        'Microsoft Zira',
        'Zira',
        'Samantha',
      ];

      let match = candidates.find((v) =>
        preferredNames.some((p) =>
          (v.name || '').toLowerCase().includes(p.toLowerCase())
        )
      );

      if (!match && candidates.length) match = candidates[0];

      this.preferredVoice = match || null;
    } catch (e) {
      this.preferredVoice = null;
    }
  }

//   isCorrect(userAnswer: string, expected: string): boolean {
//     const normalize = (t: string) => t.toLowerCase().trim();
//     return normalize(userAnswer) === normalize(expected);
//   }


    isCorrect(userAnswer: string, expected: string | string[]): boolean {
      // Converte expected para array para suportar múltiplas possibilidades
      const expectedArr = Array.isArray(expected) ? expected : [expected];

      const normalize = (t: string) => t.toLowerCase()
          // remove pontuação comum
          .replace(/[.,!?:;"'’“”\-]/g, '')
          // colapsa múltiplos espaços
          .replace(/\s+/g, ' ')
          .trim();

      const userNorm = normalize(userAnswer);

      // Se bater exatamente com qualquer forma normalizada, aceita
      for (const exp of expectedArr) {
        const expNorm = normalize(exp);
        if (userNorm === expNorm) return true;

        // Fallback: similaridade por Levenshtein
        const sim = this.stringSimilarity(userNorm, expNorm);
        if (sim >= 0.85) return true; // ajuste o limiar se quiser ser mais/menos rígido
      }
      return false;
    }

    /** Similaridade 0..1 (1 = idêntico) baseada na distância de Levenshtein */
    private stringSimilarity(a: string, b: string): number {
      const distance = this.levenshtein(a, b);
      const maxLen = Math.max(a.length, b.length) || 1;
      return 1 - distance / maxLen;
    }

    /** Distância de Levenshtein */
    private levenshtein(a: string, b: string): number {
      const m = a.length;
      const n = b.length;
      const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,       // deleção
            dp[i][j - 1] + 1,       // inserção
            dp[i - 1][j - 1] + cost // substituição
          );
        }
      }
      return dp[m][n];

    }
}