import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
    MatButtonModule,
    MatInputModule, 
    MatIconModule, 
    MatToolbarModule, 
    MatButtonToggleModule,
    MatCardModule, 
    MatTabsModule,
    MatBadgeModule} from '@angular/material'

import { WebsiteRoutingModule } from './website-routing.module';
import { UserHomeComponent } from './user-home/user-home.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { NavbarComponent } from './navbar/navbar.component'; 
import { LoginComponent } from '../login/login.component';
import { RegistrationComponent } from '../registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { UserComponent } from './user/user.component';
import { UserMessageComponent } from './user-message/user-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WebsiteRoutingModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatCardModule,
    MatTabsModule,
    MatBadgeModule
  ],
  declarations: [UserHomeComponent, HomeComponent, ChatComponent, NavbarComponent, LoginComponent, RegistrationComponent, EditInfoComponent, UserComponent, UserMessageComponent]
  
})
export class WebsiteModule { }
