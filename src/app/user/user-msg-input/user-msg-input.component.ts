import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';

import { Observable } from 'rxjs';
import { delay, filter, map, switchMap, take, tap } from 'rxjs/operators';
import {ChuckService} from '../../shared/services/chuck.service';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarDismiss } 
        from '@angular/material/snack-bar'; 

import * as firebase from "firebase/app";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 

import * as dayjs from 'dayjs';

import { BotInterface } from 'src/app/shared/model/user';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
        
@Component({
  selector: 'app-user-msg-input',
  templateUrl: './user-msg-input.component.html',
  styleUrls: ['./user-msg-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMsgInputComponent implements OnInit {
  userFG: FormGroup;
  
  public curUser$: Observable<BotInterface|null> = null; 
  public curUser: BotInterface | null = null; 
  public joke: string = null;
  public chuckLink: string = 'https://api.chucknorris.io/jokes/random';
  public responceBool: boolean = false;
  get user_message() { return this.userFG.get('user_message'); } 
  
  @Input('user-type') user_type: string;  
  // --------------------------------------------------------------
  private simpleSnackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  public userUID: string = JSON.parse(localStorage.getItem('user')).uid;
  // -------------------------------------------------------------- 

  constructor(
    private fb: FormBuilder,
    private snackBarSrv: MatSnackBar,
    private readonly ngFireStore: AngularFirestore,
    public currentUserSrv: CurrentUserService,
    public jokeService: ChuckService
    
  ) { }

  ngOnInit(): 
  void {
    this.userFG = this.fb.group({
      user_message: ['', {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ],
        updateOn: 'change' }
      ],
    });
    
    this.curUser$ = this.currentUserSrv.currentUser$
    .pipe(
      filter((user: BotInterface) => user != null),
      tap((user: BotInterface) => {
        console.log('\tPIPE: UserMsgInputComponent.ngOnInit().tap user: %O', user); 
        this.curUser = user;

      })
    );
    this.jokeService
      .getJoke(this.chuckLink)
      .subscribe(
        data => {
          this.joke = data['value'];
        },
        err => {
          console.log(err);
        }
      );
      console.log(this.joke); 
    // --------------- eom ------------------------------
  }
  
  onUserMsgSubmit({ value, valid }: { value: any, valid: boolean }, 
                    formDirective: FormGroupDirective) {
    console.log('<--- SYNC ENTER UserMsgInputComponent.onUserMsgSubmit() --->');
    if (!valid) {      
      console.log('<--- SYNC ERROR UserMsgInputComponent.onUserMsgSubmit(): invalid form!');
      return;
    }
    const userDate: Date = new Date();
    const now_ts = firebase.firestore.Timestamp.fromDate(userDate);

    const day = dayjs(userDate);

    const msgID = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 
    const msgFieldName = `${day.format('HH')}${day.format('mm')}${day.format('ss')}.${day.format('SSS')}`;

    const userMsgDoc: AngularFirestoreDocument<{ [x: string]: { source: string; text: string; }; }> = 
            this.ngFireStore.doc(`users/${this.userUID}/bots/${this.curUser.UUID}/messages/${msgID}`);
            console.log(this.responceBool);
    userMsgDoc.set({ [msgFieldName] : {
            source: this.user_type==='user' ?'user' : this.curUser.name,
            text: value.user_message
          }
      }, {merge: true}, )
    .then((_) => {
      
      console.log("THEN Message Doc updated!");

      const userDoc: AngularFirestoreDocument<Partial <{ 
        name: string; 
        my_msg: firebase.firestore.Timestamp; 
        user_msg: firebase.firestore.Timestamp; 
      }>> = 
      this.ngFireStore.doc(`users/${this.userUID}/bots/${this.curUser.UUID}`);
      
      let obj: Partial<{ // wrong!
        name: string; 
        my_msg: firebase.firestore.Timestamp; 
        user_msg: firebase.firestore.Timestamp; 
      }>;
      if (this.user_type==='user') {
        return userDoc.set({user_msg: now_ts}, {merge: true})
        
      } else {
        
        return userDoc.set({my_msg: now_ts}, {merge: true});
      }   
         
    })
    .then((_) => {
      
      console.log("THEN User Doc has been updated!");
      formDirective.resetForm();
      this.userFG.reset();     
      this.ngOnInit();
    })
    .catch(function(error) {
        console.error("Error updating Message Doc: ", error);
    });
    
      console.log('<--- SYNC EXIT UserMsgInputComponent.onUserMsgSubmit() --->');   
     
    
    setTimeout(() => {
      console.log('sleep');
      // And any other code that should run only after 5s
    const newUserDate: Date = new Date();
    const newNow_ts = firebase.firestore.Timestamp.fromDate(newUserDate);

    const newDay = dayjs(newUserDate);
    const newMsgFieldName = `${newDay.format('HH')}${newDay.format('mm')}${newDay.format('ss')}.${newDay.format('SSS')}`;

    const newUserMsgDoc: AngularFirestoreDocument<{ [x: string]: { source: string; text: string; }; }> = 
            this.ngFireStore.doc(`users/${this.userUID}/bots/${this.curUser.UUID}/messages/${msgID}`);
            newUserMsgDoc.set({ [newMsgFieldName] : {
            source:this.curUser.name,
            text: this.joke
          }
      }, {merge: true}, )
    .then((_) => {
      
      console.log("THEN Message Doc updated!");

      const userDoc: AngularFirestoreDocument<Partial <{ 
        name: string; 
        my_msg: firebase.firestore.Timestamp; 
        user_msg: firebase.firestore.Timestamp; 
      }>> = 
      this.ngFireStore.doc(`users/${this.userUID}/bots/${this.curUser.UUID}`);
      
      let obj: Partial<{ // wrong!
        name: string; 
        my_msg: firebase.firestore.Timestamp; 
        user_msg: firebase.firestore.Timestamp; 
      }>;
      
        return userDoc.set({my_msg: newNow_ts}, {merge: true});   
    })
    .then((_) => {
      
      console.log("THEN User Doc has been updated!");    
    })
    .catch(function(error) {
        console.error("Error updating Message Doc: ", error);
    });

  

  }, 10000);

  }
 
  // --------------------------eoc -----------------------------------
}

