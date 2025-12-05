
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, lastValueFrom } from 'rxjs';

export interface Dialog {
  question: string;
  translation: string;
  answer: string | string[]; // aceita múltiplas respostas
}

export interface ModuleFile {
  moduleId: string;
  title: string;
  level: string;
  dialogs: Dialog[];
}

@Injectable({ providedIn: 'root' })
export class VoiceService {
  private dialogs: Dialog[] = []; // antes era "modules: Dialog[]"
  private index = 0;
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private currentModuleId: string | null = null;

  // Evento opcional para avisar troca de módulo
  readonly moduleChanged$ = new Subject<string>();

  constructor(private http: HttpClient) {
    speechSynthesis.onvoiceschanged = () => this.pickEnglishFemaleVoice();
    this.pickEnglishFemaleVoice();
  }

  /**
   * Carrega um módulo padrão na inicialização para o Avatar ter diálogos.
   * Se já houver diálogos, não faz nada.
   */
  async loadModules(defaultModuleId: string = 'greetings') {
    if (this.dialogs.length) return;
    await this.loadModuleFromJson(defaultModuleId);
    // Se por algum motivo falhar, sem deixar vazio:
    if (!this.dialogs.length) {
      this.seedFallback();
    }
  }

  /**
   * Carrega o JSON do módulo em assets/modules/{moduleId}.json
   * e reseta o ponteiro.
   */

  async loadModuleFromJson(moduleId: string): Promise<void> {
    const file = await lastValueFrom(this.http.get<ModuleFile>(`assets/modules/${moduleId}.json`));
    this.dialogs = file.dialogs ?? [];
    this.index = 0; // ✅ aqui resetamos
    this.currentModuleId = file.moduleId || moduleId;
    this.moduleChanged$.next(this.currentModuleId); // notifica o Avatar
  }

  /** Próxima pergunta do módulo atual */
  getNextDialog(): Dialog | null {
    if (this.index < this.dialogs.length) {
      return this.dialogs[this.index++];
    }
    return null;
  }

  /** Recomeça o módulo atual */
  resetModule(): void {
    this.index = 0;
  }

  /** Fallback local para não ficar vazio se assets falhar (opcional) */
  private seedFallback() {
    this.dialogs = [
      {
        question: 'Hello! How are you?',
        translation: 'Olá! Como você está?',
        answer: ['I am fine, thank you!', "I'm fine, thank you!"]
      },
      {
        question: 'What is your name?',
        translation: 'Qual é o seu nome?',
        answer: 'My name is John.'
      }
    ];
    this.index = 0;
    this.currentModuleId = 'fallback';
    console.warn('[VoiceService] Usando diálogos de fallback (assets não encontrados).');
  }

  // ===== Reconhecimento de voz (sua lógica) =====
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

  // ===== TTS (sua lógica) =====
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
    } catch {
      this.preferredVoice = null;
    }
  }

  // ======= Validação com múltiplas respostas e similaridade =======
  isCorrect(userAnswer: string, expected: string | string[]): boolean {
    const expectedArr = Array.isArray(expected) ? expected : [expected];

    // Normaliza texto removendo pontuação/comuns, artigos e tratando contrações
    const normalize = (t: string) =>
      t
        .toLowerCase()
        .replace(/[.,!?:;"'’“”\-]/g, '')       // tira pontuação
        .replace(/\bi am\b/g, "im")            // "i am" -> "im" (contração)
        .replace(/\b(a|an)\b/g, '')            // artigos opcionais
        .replace(/\s+/g, ' ')
        .trim();

    const userNorm = normalize(userAnswer);

    for (const exp of expectedArr) {
      const expNorm = normalize(exp);
      if (userNorm === expNorm) return true;

      // Similaridade mais tolerante
      const sim = this.stringSimilarity(userNorm, expNorm);
      if (sim >= 0.80) return true; // antes 0.85
    }
    return false;
  }

  private stringSimilarity(a: string, b: string): number {
    const distance = this.levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length) || 1;
    return 1 - distance / maxLen;
  }

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
