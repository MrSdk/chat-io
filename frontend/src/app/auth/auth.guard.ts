import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { map, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthGuard implements CanActivate {

  private url = "http://localhost:8080"
  constructor( private UserSvc: UserService,private httpClient: HttpClient, private router: Router){}
  
  canActivate( ): Observable<boolean> | Promise<boolean> | boolean {
  
    return this.UserSvc.thisUser().pipe(
      catchError(()=>{ 
        return this.router.navigate(['']) 
        
      }),
      map((res)=>{
        // console.log(res);
        return true;
      })
    ) 
    
  }
 
}
