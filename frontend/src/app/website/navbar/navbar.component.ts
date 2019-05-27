import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  allow: Boolean = false;
  constructor(private UserSvc: UserService) { }


  ngOnInit() {
    this.UserSvc.setUpTime().subscribe()
    this.UserSvc.network.asObservable().subscribe(()=>{
      this.verifyUser()      
    })
    this.verifyUser()
  }

  verifyUser(){
    this.UserSvc.thisUser().subscribe(()=>{
      this.allow = true;
    },()=>{ 
      this.allow = false;
    })
  }

  logout(){
    this.UserSvc.setUpTime().subscribe()
    this.UserSvc.logout()
    this.verifyUser()
  }

}
