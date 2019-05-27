import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import Swal from 'sweetalert2' 
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  form = new FormGroup({
    login: new FormControl("",Validators.required),
    password: new FormControl("",[Validators.required,Validators.minLength(6)]),
    password2: new FormControl("",[Validators.required,Validators.minLength(6)]),
    username: new FormControl("",Validators.required),
    avatar: new FormControl(null,Validators.required)
  })

  constructor(private UserSvc: UserService, private router: Router) { }
  image;

  ngOnInit() {
  }

  changedFile(event){
    var file = ( event.target ).files[0]
    this.form.patchValue({
      avatar: file
    });

    var fileReader = new FileReader();

    fileReader.onload = ()=>{
      this.image = fileReader.result;
    }

    fileReader.readAsDataURL(file)
  }

  signup( ){
    var form: FormGroup = this.form;
    if(form.invalid){
      return
    }
    else{
      // console.log();
      
      var formData = new FormData()
      formData.append('login',this.form.get('login').value)
      formData.append('password',this.form.get('password').value)
      formData.append('username',this.form.get('username').value)
      formData.append('avatar',this.form.get('avatar').value)

      this.UserSvc.create(formData).subscribe((res)=>{
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
          title: "Error!",
          text: "Maybe this login already exist or Ethernet is not working ",
          confirmButtonText: "Ok"
        })
      })
      
    }
  }

}
