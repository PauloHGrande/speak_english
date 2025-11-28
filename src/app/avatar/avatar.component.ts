import { Component, AfterViewInit } from '@angular/core';
import { VoiceService, Dialog } from '../voice.service';

@Component({selector:'app-avatar',templateUrl:'./avatar.component.html',styleUrls:['./avatar.component.css']})
export class AvatarComponent implements AfterViewInit{
  speaking=false;listening=false;recognizedText='';feedback='';score=0;currentDialog:Dialog|null=null;
  audioContext!:AudioContext;analyser!:AnalyserNode;dataArray!:Uint8Array;
  constructor(private voice:VoiceService){}
  ngAfterViewInit(){this.initAudio();}
  async initAudio(){try{this.audioContext=new AudioContext();const stream=await navigator.mediaDevices.getUserMedia({audio:true});const source=this.audioContext.createMediaStreamSource(stream);this.analyser=this.audioContext.createAnalyser();source.connect(this.analyser);this.analyser.fftSize=256;const bufferLength=this.analyser.frequencyBinCount;this.dataArray=new Uint8Array(bufferLength);this.animateMouthByMic();await this.voice.loadModules();this.nextQuestion();}catch(err){console.error('Microfone não disponível',err);}}
  animateMouthByMic(){const loop=()=>{requestAnimationFrame(loop);if(!this.analyser)return;this.analyser.getByteFrequencyData(this.dataArray);const v=this.dataArray.reduce((a,b)=>a+b,0)/this.dataArray.length;this.speaking=v>28;};loop();}
  toggleListen(){if(this.listening){this.listening=false;return;}this.listening=true;this.voice.startRecognition((text:string)=>{this.listening=false;this.recognizedText=text;this.checkAnswer(text);});}
  checkAnswer(text:string){if(!this.currentDialog)return;const correct=this.voice.isCorrect(text,this.currentDialog.answer);if(correct){this.feedback='✅ Correct!';this.score+=10;this.speakWithMouth('Great!');setTimeout(()=>this.nextQuestion(),1500);}else{this.feedback='❌ Try again';this.speakWithMouth('Please try again');}}
  nextQuestion(){this.currentDialog=this.voice.getNextDialog();if(this.currentDialog){this.feedback='';this.speakWithMouth(this.currentDialog.question);}else{this.speakWithMouth('Congratulations! You finished this module.');}}
  speakWithMouth(text:string,cb?:()=>void){this.voice.speak(text,{onstart:()=>{this.speaking=true;},onboundary:()=>{this.speaking=!this.speaking;},onend:()=>{this.speaking=false;if(cb)cb();}});}
}