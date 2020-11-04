import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule, SETTINGS} from "@angular/fire/firestore"; 
import { AngularFireAuthModule } from "@angular/fire/auth";

import { NgMaterialModule } from './ng-material.module';

import { AppRoutingModule } from './app-routing.module'; 

import {environment} from '../environments/environment'; 
  
import { AppComponent } from './app.component';
import { MainContainerComponent } from './home/main-container/main-container.component';
import { UserMsgInputComponent } from './user/user-msg-input/user-msg-input.component';
import { UserChatComponent } from './user/user-chat/user-chat.component';
import { UserListComponent } from './user-list/user-list/user-list.component';

import { MsgObjToArrayPipe } from './shared/pipes/msg-obj-to-array.pipe';
import { PageNotFoundComponent } from './page-not-found.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

import { AuthService } from "./shared/services/auth.service";
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
@NgModule({
  declarations: [
    AppComponent,
    MainContainerComponent,
    UserMsgInputComponent,
    UserChatComponent,
    UserListComponent,
    MsgObjToArrayPipe,
    PageNotFoundComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    
    FormsModule,
    ReactiveFormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    NgMaterialModule,
    AppRoutingModule,
    
  ],
  providers: [
AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
