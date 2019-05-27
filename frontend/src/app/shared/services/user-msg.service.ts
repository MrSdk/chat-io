import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UserMsgService {
  private url = "http://localhost:8080"

  constructor(private httpClient: HttpClient) { 
  }

  create(data,id){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null"
    return this.httpClient.post(this.url + '/user_message/' + token + '/' + id , data).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  get(id){ 
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null"
    return this.httpClient.get(this.url + '/user_message/' + token + '/' + id).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  update(data,id){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null"
    return this.httpClient.patch(this.url + '/user_message/' + token + '/' + id , data).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  delete(id){ 
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null"
    return this.httpClient.delete(this.url + '/user_message/' + token + '/' + id).pipe(
      map((res)=>{
        return res;
      })
    )
  }

  getMessagesWithUsers(){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null"
    return this.httpClient.get(this.url + '/user/MsgesWithUsers/' + token ).pipe(
      map((res)=>{
        return res;
      })
    )
  }
 
}
