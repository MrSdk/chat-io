import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
// import * as SocketIO from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  private url = "http://localhost:8080"

  constructor(private httpClient: HttpClient) { 
  }

  ngOnInit() {
  }

  create(data){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null"
    return this.httpClient.post(this.url + "/message/" + token, data).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  get(){
    return this.httpClient.get(this.url + "/messages").pipe(
      map((res) => {
        return res
      })
    )
  }

  update(data){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null"
    return this.httpClient.patch(this.url + "/message/" + token, data).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  delete(id){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null"
    return this.httpClient.delete(this.url + "/message/" + token + "/" + id ).pipe(
      map((res)=>{
        return res;
      })
    )
  }
  
}
