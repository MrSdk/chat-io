import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css']
})
export class EditInfoComponent implements OnInit {

  private user: any = {};
  image;
  checkedFile:boolean = false;
  passwordInfo:any = {}

  constructor(private UserSvc: UserService,private router: Router) { }

  ngOnInit() {
    this.UserSvc.setUpTime().subscribe()
    this.UserSvc.thisUser().subscribe((res)=>{
      this.user = res
      this.image = this.user.avatar;

    })
  }

  changeImage(event){
    var file = ( event.target ).files[0];
    this.user.avatar = file;
    this.checkedFile = true;

    var reader = new FileReader()

    reader.onload = ()=>{
      this.image = reader.result
    }

    reader.readAsDataURL(file)
  }

  clickInfo(){
    this.user.mode = "info"

    var formData = new FormData()
    formData.append('login',this.user.login)
    formData.append('username',this.user.username)
    formData.append('status',this.user.status)
    formData.append('mode',this.user.mode)
    
    if( this.checkedFile ){
      formData.append('avatar',this.user.avatar)
    }

    this.UserSvc.update(formData).subscribe(()=>{
      Swal.fire({
        title: "Updated",
        type: "success",
        text: "Do you want to continue",
        confirmButtonText: "Ok"
      }).then(()=>{
        this.UserSvc.network.next();
        this.router.navigate(['user'])
      });
    },()=>{
      Swal.fire({
        title: "Error!",
        type: "error",
        text: "Ethernet not working or something went wrong",
        confirmButtonText: "Ok"
      })
    })

  }

  clickPass(){
    if( this.passwordInfo.newPass2 !== this.passwordInfo.newPass || (this.passwordInfo.newPass == undefined) || (this.passwordInfo.newPass2 == undefined) || (this.passwordInfo.current == undefined)) {
       
    return;
    }
    else{ 
      this.UserSvc.update({ currentPass: this.passwordInfo.current, 
                            newPass: this.passwordInfo.newPass, 
                            mode: "pass" }).subscribe(()=>{
        Swal.fire({
          title: "Updated",
          type: "success",
          text: "Do you want to continue",
          confirmButtonText: "Ok"
        }).then(()=>{
          this.router.navigate(['user'])
        });
        this.UserSvc.network.next();
      },()=>{
        Swal.fire({
          title: "Error!",
          type: "error",
          text: "Ethernet not working or password incorrect",
          confirmButtonText: "Ok"
        })
      })
    }
    
  }

  onDelete(){
    Swal.fire({
      title: 'Важно!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes I do!',
      cancelButtonText: 'No yet'
    }).then((result)=>{
      try {
        if(result.value === true){
           this.UserSvc.delete().subscribe(()=>{
            Swal.fire({
              title: 'Success',
              text: "Accaunt deleted !",
              type: 'warning',
              confirmButtonText: "Good bye"
            })
           },()=>{
            Swal.fire({
              title: 'Error',
              text: "Ethernet maybe not working ",
              type: 'error',
              confirmButtonText: "ok"
            })
           })
        }
      } catch (error) {}
    }) 
  }

}
