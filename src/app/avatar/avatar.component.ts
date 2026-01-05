
import { Component, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { VoiceService, Dialog } from '../voice.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
  animations: [
    trigger('fadeIn', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(10px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden <=> visible', animate('300ms ease-out'))
    ])
  ]
})
export class AvatarComponent implements AfterViewInit {
  speaking = false;
  listening = false;
  isSpeakingTTS = false; // Track TTS speech separately
  isActive = false; // Track if avatar is actively engaged
  recognizedText = '';
  feedback = '';
  score = 0;
  answeredCorrectly = false; // Track if current question was answered correctly
  currentDialog: Dialog | null = null;
  currentQuestion = 0;
  totalQuestions = 0;
  showContent = true; // For fade transitions

  audioContext!: AudioContext;
  analyser!: AnalyserNode;
  dataArray!: Uint8Array;
  private advanceTimer: any = null; // manter referencia pra limpar


  // avatar.component.ts (adicione no constructor)
  constructor(private voice: VoiceService) {
    // Quando módulo mudar, limpamos estados e pedimos a primeira pergunta
    this.voice.moduleChanged$.subscribe(() => {
      // cancela qualquer avanço pendente
      if (this.advanceTimer) {
        clearTimeout(this.advanceTimer);
        this.advanceTimer = null;
      }

      this.listening = false;
      this.feedback = '';
      this.recognizedText = '';
      this.score = 0;
      this.currentDialog = null;
      this.answeredCorrectly = false; // Reset on module change

      this.nextQuestion();
    });
  }

  ngAfterViewInit() {
    this.initAudio();
  }

  async initAudio() {
    try {
      this.audioContext = new AudioContext();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(stream);

      this.analyser = this.audioContext.createAnalyser();
      source.connect(this.analyser);
      this.analyser.fftSize = 256;

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      this.animateMouthByMic();

      await this.voice.loadModules();
      // nextQuestion is called by moduleChanged$ subscription, no need to call it here
    } catch (err) {
      console.error('Microfone não disponível', err);
    }
  }

  animateMouthByMic() {
    const loop = () => {
      requestAnimationFrame(loop);
      if (!this.analyser) return;

      this.analyser.getByteFrequencyData(this.dataArray);
      const v =
        this.dataArray.reduce((a, b) => a + b, 0) / this.dataArray.length;

      // Only move mouth when TTS is speaking OR when listening AND voice detected above threshold
      const voiceDetected = v > 50; // Increased threshold to prevent ambient noise
      this.speaking = this.isSpeakingTTS || (this.listening && voiceDetected);

      // Avatar is active when listening or speaking
      this.isActive = this.listening || this.isSpeakingTTS;
    };

    loop();
  }

  toggleListen() {
    if (this.listening) {
      this.listening = false;
      return;
    }

    this.listening = true;

    this.voice.startRecognition((text: string) => {
      this.listening = false;
      this.recognizedText = text;
      this.checkAnswer(text);
    });
  }

  checkAnswer(text: string) {
    if (!this.currentDialog) return;

    const correct = this.voice.isCorrect(text, this.currentDialog.answer);

    if (correct) {
      this.feedback = '✅ Correct!';
      this.score += 10;
      this.answeredCorrectly = true; // Mark as answered correctly

      // Cancela qualquer timer antigo
      if (this.advanceTimer) {
        clearTimeout(this.advanceTimer);
        this.advanceTimer = null;
      }

      // Avança quando o TTS terminar (robusto)
      this.speakWithMouth('Great!', () => {
        this.nextQuestion();
      });

      // Se você preferir usar tempo fixo, mantenha mas limpe sempre:
      // this.advanceTimer = setTimeout(() => this.nextQuestion(), 1200);
    } else {
      this.feedback = '❌ Try again';
      this.answeredCorrectly = false; // Not answered correctly
      this.speakWithMouth('Please try again');
    }
  }

  nextQuestion() {
    // Fade out transition
    this.showContent = false;

    setTimeout(() => {
      const next = this.voice.getNextDialog();
      this.currentDialog = next;
      this.currentQuestion = this.voice.getCurrentQuestionNumber();
      this.totalQuestions = this.voice.getTotalQuestions();

      if (next) {
        this.feedback = '';
        this.recognizedText = '';
        this.answeredCorrectly = false; // Reset for new question
        this.speakWithMouth(next.question);
      } else {
        this.speakWithMouth('Congratulations! You finished this module.');
      }

      // Fade in transition
      this.showContent = true;
    }, 300);
  }

  replayQuestion() {
    if (this.currentDialog) {
      this.speakWithMouth(this.currentDialog.question);
    }
  }

  skipQuestion() {
    if (this.advanceTimer) {
      clearTimeout(this.advanceTimer);
      this.advanceTimer = null;
    }
    this.nextQuestion();
  }


  speakWithMouth(text: string, cb?: () => void) {
    this.voice.speak(text, {
      onstart: () => {
        this.isSpeakingTTS = true;
      },
      onboundary: () => {
        // Create subtle mouth variation during TTS speech
        // This adds natural rhythm to the mouth movement
      },
      onend: () => {
        this.isSpeakingTTS = false;
        if (cb) cb();
      },
    });
  }

  playCorrectAnswer(): void {
    if (!this.currentDialog) return;

    // Aceita answer como string ou string[]
    const answer = Array.isArray(this.currentDialog.answer)
      ? this.currentDialog.answer[0]
      : this.currentDialog.answer;

    // Fala a resposta correta
    this.speakWithMouth(answer);
  }

  // Get formatted answer for display (only first answer if array)
  getDisplayAnswer(): string {
    if (!this.currentDialog) return '';

    if (Array.isArray(this.currentDialog.answer)) {
      return this.currentDialog.answer[0];
    }
    return this.currentDialog.answer;
  }

}
