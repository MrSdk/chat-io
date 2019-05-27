import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { ChatComponent } from './chat/chat.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';
import { AuthGuard } from '../auth/auth.guard';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { UserComponent } from './user/user.component';
import { UserMessageComponent } from './user-message/user-message.component';

const routes: Routes = [
  {path:'',component:NavbarComponent,children:[
    {path:'',component:HomeComponent},
    {path:'user',component:UserHomeComponent,canActivate: [AuthGuard]},
    {path:'user/:id',component:UserComponent},
    {path:"user/message/:id",component:UserMessageComponent},
    {path:'edit',component:EditInfoComponent,canActivate: [AuthGuard]},
    {path:'chat',component:ChatComponent,canActivate: [AuthGuard]},
    {path:'login',component:LoginComponent},
    {path:'registration',component:RegistrationComponent},
    {path:'**',redirectTo:'',pathMatch:'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
