import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private UserSvc: UserService, private router: Router) { }

  ngOnInit() {
  }

  login(form: NgForm){
    if(form.invalid){
      return
    }
    else{
      var formm: User = form.value;
      this.UserSvc.login(formm).subscribe(()=>{
        Swal.fire({
          title: 'Yes!',
          text: 'Do you want to continue',
          type: "success",
          confirmButtonText: "Ok"
        });
        this.UserSvc.network.next()
        this.router.navigate(['user'])
      },()=>{
        Swal.fire({
          type: "error",
          title: "No",
          text: "User not found or Ethernet is not working ",
          confirmButtonText: "Ok"
        })
      })
    }
    
  }
}
