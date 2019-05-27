import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { UserService } from 'src/app/shared/services/user.service'; 
import { User } from 'src/app/shared/models/user.model';
import { Message } from 'src/app/shared/models/message.model';
import Swal from 'sweetalert2';
import { UserMsgService } from 'src/app/shared/services/user-msg.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.css']
})
export class UserMessageComponent implements OnInit {

  a = false;
  message: String;
  messages = [];
  users: User[] = [];
  dates = [];
  images = [];
  user: any = {};
  onEdit = false;
  checkedMsgId: String;
  condition;
  user_id: String;
  checkedUser: User;
  lastTime = "seen recently";
  hasDate;
  months = ["January","February","March","April","May","June","July","August","September","Novamber","December"]

  constructor(private chatSvc: ChatService, private userSvc: UserService, private socket: SocketService, private userMsgSvc: UserMsgService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getUserId()
    this.userSvc.setUpTime().subscribe()
    this.getUsers()
    this.getCountMsg()
    this.getUser()
    this.onLoadMessages()
  }

  onLoadMessages(){
    this.socket.onLoadUserMsg().subscribe((res)=>{
      console.log("How are youuuuu");
      console.log(res);
      
      this.getMessages()
    })
  }

  onLooked(){
    if(this.user_id && this.user._id){
      this.socket.setOnLooked(this.user_id,this.user._id)
    }
    else{
      console.log(this.user_id + " " + this.user._id);

    }
  }

  goBack(){
    this.router.navigate(['user/' + this.user_id])    
  }

  getUserId(){
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
            this.getMessages()
            
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

  getUser(){
    this.userSvc.thisUser().subscribe((res)=>{
      this.user = res; 
      
    this.onLooked()
    })
  }

  getCountMsg(){
    this.socket.getCountUserMsg().subscribe((count: any)=>{
      console.log("GET COUNT");
        
        this.getMessages()
      
    })
  }

  getMessages() {
     
    this.userMsgSvc.get(this.user_id).subscribe((res: any) => {
      
      this.messages = res.messages; 

      // console.log(this.messages); 
      this.messages.map( msg => {
        var has = false;
      
            this.dates.map( data => {
              if( this.verifyOfDates(data,msg.date) ){
                has = true;
              }
            } )
            if(!has){
              this.dates.push(msg.date.toString())
            }
      
          } );
      this.messages.map( (msg: any) => {
          var valuee = undefined;
          if( (this.dates.find(date => this.verifyOfDates(date,msg.date)))){
            var data = this.dates.find( date => this.verifyOfDates(date,msg.date) ); 
            var removeDate = this.dates;
            this.dates = [];
            removeDate.map((date)=>{
              if(date !== data){
                this.dates.push(date)
              }
            })
            valuee = data
          }
          msg.day = valuee
      } );
    })
  }

  getUsers() {
    this.userSvc.getUsers().subscribe((res: any) => {
      this.users = res.users;
      this.checkedUser = this.users.find( userr => userr._id === this.user_id )
      this.hasDate = new Date(this.checkedUser ? this.checkedUser.ontime : null); 
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

  hasAvatar(message){
    var has = true;
    for(let i=0;i<this.messages.length;i++){
      if( i > 0 ){
        if( message._id === this.messages[i]._id ){
          if( this.messages[i-1].user1 === message.user1 ){
            has = false;
          }
        }
      }
    }
    return has;
  }
  // getAvatar(id: String) {
  //   return this.users.find(user => user._id === id);
  // }

  send() {

    if (!this.message) {
      return;
    } else {

      this.userMsgSvc.create({ text: this.message, date: new Date() },this.user_id).subscribe(() => { }, () => {

        this.getMessages()
        Swal.fire({
          title: "Error!",
          type: "error",
          text: "Ethernet not working",
          confirmButtonText: "Ok"
        })
      })

    }
    this.message = null;
  }

  verifyOfDates(date1_,date2_){
    var date1 = new Date(date1_)
    var date2 = new Date(date2_)
 
    var a = date1.getMonth() + " " + date1.getDate() + " " + date1.getFullYear();
    var b = date2.getMonth() + " " + date2.getDate() + " " + date2.getFullYear(); 
     
    return a == b;
  }
  // verifyImage(img){
  //   var has = false;
  //   if( !this.images.find( image => image === img ) ){
  //     this.images.push(img);
  //     console.log("AAAAAAAaa");
      
  //     has = true;
  //   }

  //   return false
  // }

  changeInput(text){
    if( text === "" ){
      this.onEdit = false;
      this.checkedMsgId = null;
    }
  }

  onEditText(message){
    this.checkedMsgId = message._id;
    this.onEdit = true;
    this.message = message.text1  
    
  }

  edit(){ 
    this.userMsgSvc.update({message: this.message, message_id: this.checkedMsgId},this.user_id).subscribe(()=>{
      this.message = null;
      this.onEdit = false;
      this.checkedMsgId = null
    })
  }

  onDelete(id: String){
    Swal.fire({
      title: 'Are you sure delete of this message ?',
      animation: false,
      customClass: {
        popup: 'animated tada'
      }
    }).then((res)=>{
        if(res.value === true){
          this.userMsgSvc.delete(id).subscribe()
        }
      
    })
  }

}
