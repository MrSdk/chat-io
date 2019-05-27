import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { UserMsgService } from 'src/app/shared/services/user-msg.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  user: User;
  users: User[] = [];
  necessaryUsers = []
  condition;
  hasDate;
  lastTime;
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Novamber", "December"]

  constructor(private UserSvc: UserService, private userMsgSvc: UserMsgService, private router: Router) {
    this.hasDate = new Date();
  }

  ngOnInit() {
    this.UserSvc.setUpTime().subscribe()
    this.UserSvc.thisUser().subscribe((res) => {
      this.user = res


    })
    this.verifyCondition()
    this.getNecessaryUsers()
    this.getUsers()
  }

  getNecessaryUsers() {
    this.userMsgSvc.getMessagesWithUsers().subscribe((res: any) => {
      this.necessaryUsers = res.users;
    })
  }

  getUsers() {
    this.UserSvc.getUsers().subscribe((res: any) => {
      this.users = res.users;
    })
  }

  getUserData(id: String){
    return this.users.find( user => user._id === id )
  }

  verifyCondition() {
    var curDate = new Date();
    if ((this.hasDate.getDate() === curDate.getDate()) && (this.hasDate.getHours() === curDate.getHours()) && (this.hasDate.getMinutes() === curDate.getMinutes()) && (this.hasDate.getSeconds() === curDate.getSeconds())) {
      this.condition = true;
    }
    else {
      this.lastTime = "seen ";
      if (this.hasDate.getDate() === curDate.getDate()) {
        if (this.hasDate.getHours() === curDate.getHours()) {
          if (this.hasDate.getMinutes() === curDate.getMinutes()) {
            this.lastTime += "just now";
          }
          else {
            this.lastTime += curDate.getMinutes() - this.hasDate.getMinutes() + " minutes ago"
          }
        }
        else {
          this.lastTime += curDate.getHours() - this.hasDate.getHours() + " hours ago"
        }
      }
      else if (this.hasDate.getDate() + 1 === curDate.getDate()) {
        this.lastTime += "yesterday at " + this.hasDate.getHours() + ":" + this.hasDate.getMinutes();
      }
      else {
        this.lastTime += this.hasDate.getDate() + " " + this.months[this.hasDate.getMonth()] + " at " + this.hasDate.getHours() + ":" + this.hasDate.getMinutes();
      }


      this.condition = false;
    }
    // console.log(this.hasDate + " \n"  + " " + new Date().getTime());

  }

  goPrivateChat(user_id: String){
    this.router.navigate(['user/message/' + user_id])
  }

}
