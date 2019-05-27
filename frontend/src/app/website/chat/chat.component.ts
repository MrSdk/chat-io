import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';
import { ChatService } from 'src/app/shared/services/chat.service';
import Swal from 'sweetalert2';
import { Message } from '../../shared/models/message.model';
import { UserService } from 'src/app/shared/services/user.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
 a = false;
  message: String;
  messages: Message[];
  users: User[] = [];
  dates = [];
  images = [];
  user = {};
  onEdit = false;
  checkedMsgId: String;

  constructor(private chatSvc: ChatService, private userSvc: UserService,private socket: SocketService) {
    // console.log(this.verifyOfDates("2019-05-01T17:08:36.326Z","2019-05-01T15:27:49.547Z"));
  
  }

  ngOnInit() {
    this.userSvc.setUpTime().subscribe()
    this.getMessages()
    this.getUsers()
    this.getCountMsg()
    this.getUser()
  }

  getUser(){
    this.userSvc.thisUser().subscribe((res)=>{
      this.user = res; 
    })
  }

  getCountMsg(){
    this.socket.getCountOfMsg().subscribe((count: any)=>{
      console.log("GET COUNT");
        
        this.getMessages()
      
    })
  }

  getMessages() {
    this.chatSvc.get().subscribe((res: any) => {
      this.messages = res.messages;
      // console.log(this.messages);
      console.log(this.messages.length);
      
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
    })
  }

  hasAvatar(message){
    var has = true;
    for(let i=0;i<this.messages.length;i++){
      if( i > 0 ){
        if( message._id === this.messages[i]._id ){
          if( this.messages[i-1].user_id === message.user_id ){
            has = false;
          }
        }
      }
    }
    return has;
  }
  getAvatar(id: String) {
    return this.users.find(user => user._id === id);
  }

  send() {

    if (!this.message) {
      return;
    } else {

      this.chatSvc.create({ message: this.message, date: new Date() }).subscribe(() => { }, () => {

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
  verifyImage(img){
    var has = false;
    if( !this.images.find( image => image === img ) ){
      this.images.push(img);
      console.log("AAAAAAAaa");
      
      has = true;
    }

    return false
  }

  changeInput(text){
    if( text === "" ){
      this.onEdit = false;
      this.checkedMsgId = null;
    }
  }

  onEditText(message){
    this.checkedMsgId = message._id;
    this.onEdit = true;
    this.message = message.message 
    
  }

  edit(){ 
    this.chatSvc.update({message: this.message, message_id: this.checkedMsgId}).subscribe(()=>{
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
          this.chatSvc.delete(id).subscribe()
        }
      
    })
  }

}
