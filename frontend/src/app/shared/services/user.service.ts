import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { User } from '../models/user.model';
import { Subject } from 'rxjs';
import { Route, Router } from '@angular/router';
import { SocketService } from './socket.service';
// import { of } from 'rxjs/observable/of';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  network = new Subject()
  
  private url = "http://localhost:8080"
  constructor(private httpClient: HttpClient, private router: Router, private socket: SocketService) { }

  public create(formData: FormData){
    formData.append('ontime',`${new Date()}`)
    return this.httpClient.post(this.url + '/user/create',formData).pipe(
      map((res: any)=>{
        console.log(res);
        
        this.setAuthToken(res.token)
        return res
      })
    )
  }

  public login(data: User){
    return this.httpClient.post(this.url + '/user/login',data).pipe(
      map((res: any)=>{
        if(res.token){
          this.setAuthToken(res.token)
          return
        }
      })
    )
  }

  public thisUser(){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null";
    // console.log(token);
    
    return this.httpClient.get(this.url + "/user/" + token).pipe(
      
      map((res: any)=>{
        // console.log(res);
        return res;
      })
    )
  }

  public update(data){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null";
    
    return this.httpClient.patch(this.url + '/user/informations/' + token, data).pipe(
      map((res: any)=>{

        try {
          if(res.token){
            this.setAuthToken(res.token)
          }
        } catch (error) {
          
        } 
        return res
      })
    )
  }

  public getUsers(){
    return this.httpClient.get(this.url + "/users").pipe(
      map((res)=>{
        return res;
      })
    )
  }

  private setAuthToken(token){
    localStorage.setItem('token',token)
  }

  public logout(){
    localStorage.removeItem('token');
    this.network.next(true);
    this.router.navigate([''])
  }

  public delete(){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null";
   
    return this.httpClient.delete(this.url + "/user/" + token).pipe(
      map((res)=>{
        this.logout();
        return res;
      })
    )
  }

  public setUpTime(){
    var token = localStorage.getItem('token') ? localStorage.getItem('token') : "null";

    return this.httpClient.post(this.url + "/set/time/" + token,{ time: new Date() }).pipe(
      map((res)=>{
        return res;
      })
    )
  }
}
