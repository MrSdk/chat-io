import { Injectable } from '@angular/core';
import * as socketIO from 'socket.io-client'
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  public messages = new Subject()
  AsObservMessage = this.messages.asObservable()

  private socket;

  constructor() {
    this.initScoket()
  }

  initScoket(){
    this.socket = socketIO("http://localhost:8080/test");
  }

  setOnLooked(user_id1,user_id2){
    this.socket.emit('lookedMsg',{user1: user_id1 ,user2: user_id2})
  }

  onLoadUserMsg(){
    return new Observable((observer)=>{
      this.socket.on('onLoad',(data)=>{
        observer.next(data)
      })
    })
  }

  getCountOfMsg(){
    return new Observable((observer)=>{
      this.socket.on('countMsg',(data)=>{
        observer.next(data)
      })
    })
  }

  getCountUserMsg(){
    return new Observable((observer)=>{
      this.socket.on('countUserMsg',(data)=>{
        observer.next(data)
      })
    })
  }

}