import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user;
  user_id;
  condition;
  hasDate;
  lastTime = "seen recently";
  months = ["January","February","March","April","May","June","July","August","September","Novamber","December"]

  constructor(private userSvc: UserService,private route: ActivatedRoute,private router: Router) 
  {
  }

  ngOnInit() {
    this.userSvc.setUpTime().subscribe()
    this.getId()
    this.getUsers()
    
  }

  getId(){
    this.route.params.subscribe((query)=>{
      if(query){
        if(query.id){
          this.userSvc.getUsers().subscribe((res: any) => {
            var users = res.users;
            var verify = users.find( userr => userr._id === query.id )
              if(!verify){
                this.router.navigate(['chat'])     
              }
            this.user_id = query.id;
          })
        }else{
          this.router.navigate(['chat'])
        }
      }
      else{
        this.router.navigate(['chat'])
      }
      
    })
  }

  getUsers(){
    this.userSvc.getUsers().subscribe((res: any)=>{
     
      var users = res.users;
      this.user = users.find( user => user._id === this.user_id )
      if( !this.user ){
        this.router.navigate(['chat'])
      }
      this.hasDate = new Date(this.user.ontime); 
      this.verifyCondition()
    })
  }
  
  verifyCondition(){
    var curDate = new Date(); 
    
    if( (this.hasDate.getDate() === curDate.getDate()) && (this.hasDate.getHours() === curDate.getHours()) && (this.hasDate.getMinutes() === curDate.getMinutes()) && (( (curDate.getSeconds()  + curDate.getMinutes()*60 ) - (this.hasDate.getSeconds() + this.hasDate.getMinutes()*60) ) < 10) ) {
      this.condition = true;
    }
    else{
      this.lastTime = "seen ";
      if( this.hasDate.getDate() === curDate.getDate() ){
        if( this.hasDate.getHours() === curDate.getHours() ){
          if( this.hasDate.getMinutes() === curDate.getMinutes() ){
            this.lastTime += "just now";
          }
          else{
            this.lastTime += curDate.getMinutes() - this.hasDate.getMinutes() + " minutes ago"
          }
        }
        else{
          this.lastTime += curDate.getHours() - this.hasDate.getHours() + " hours ago"
        }
      }
      else if( this.hasDate.getDate() + 1 === curDate.getDate() ){
        this.lastTime += "yesterday at " + this.hasDate.getHours() + ":" + this.hasDate.getMinutes();
      }
      else{
        this.lastTime += this.hasDate.getDate() + " " + this.months[this.hasDate.getMonth()] + " at " + this.hasDate.getHours() + ":" + this.hasDate.getMinutes();
      }


      this.condition = false;   
    }
    // console.log(this.hasDate + " \n"  + " " + new Date().getTime());
    
  }

  goMessage(){
    this.router.navigate(['user/message/' + this.user_id])
  }

}
