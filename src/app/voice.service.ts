import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
export interface Dialog{question:string;translation:string;answer:string}
@Injectable({providedIn:'root'})
export class VoiceService{
  private modules:Dialog[]=[];private index=0;private preferredVoice:SpeechSynthesisVoice|null=null;
  constructor(private http:HttpClient){speechSynthesis.onvoiceschanged=()=>{this.pickEnglishFemaleVoice();};this.pickEnglishFemaleVoice();}
  async loadModules(){if(this.modules.length)return;this.modules=await this.http.get<Dialog[]>('modules.json').toPromise();}
  getNextDialog():Dialog|null{if(this.index<this.modules.length){return this.modules[this.index++];}return null;}
  startRecognition(callback:(text:string)=>void){const SR:any=(window as any).webkitSpeechRecognition||(window as any).SpeechRecognition;if(!SR){console.warn('Web Speech API não suportada');return;}const recognition=new SR();recognition.lang='en-US';recognition.interimResults=false;recognition.maxAlternatives=1;recognition.onresult=(e:any)=>{const text=e.results[0][0].transcript;console.log('Reconhecido:',text);callback(text);};recognition.start();}
  speak(text:string,handlers?:{onstart?:()=>void;onboundary?:()=>void;onend?:()=>void}){const utter=new SpeechSynthesisUtterance(text);utter.lang='en-US';if(this.preferredVoice)utter.voice=this.preferredVoice;if(handlers?.onstart)utter.onstart=handlers.onstart;if(handlers?.onboundary)utter.onboundary=handlers.onboundary;if(handlers?.onend)utter.onend=handlers.onend;speechSynthesis.speak(utter);}
  private pickEnglishFemaleVoice(){try{const voices=speechSynthesis.getVoices();const candidates=voices.filter(v=>(v.lang||'').toLowerCase().startsWith('en'));const preferredNames=['Google UK English Female','Google US English','Microsoft Zira','Zira','Samantha'];let match=candidates.find(v=>preferredNames.some(p=>(v.name||'').toLowerCase().includes(p.toLowerCase())));if(!match&&candidates.length)match=candidates[0];this.preferredVoice=match||null;}catch(e){this.preferredVoice=null;}}
  isCorrect(userAnswer:string,expected:string):boolean{const normalize=(t:string)=>t.toLowerCase().trim();return normalize(userAnswer)===normalize(expected);}
}