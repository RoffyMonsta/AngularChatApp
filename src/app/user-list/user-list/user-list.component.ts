import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { tap, map, filter, switchMap, delay } from 'rxjs/operators'; 

import { MatSnackBar, SimpleSnackBar, MatSnackBarRef,
  MatSnackBarDismiss} from '@angular/material/snack-bar';

import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";  
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 
import {AuthService} from "../../shared/services/auth.service";
import * as dayjs from 'dayjs';
import { BotInterface } from 'src/app/shared/model/user';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit, OnDestroy {
  // users = Array.from({length: 25}, (_, i) => `User ${++i}`);
  searchFG: FormGroup;
  public searchField: string = null;
  public currentUserList$: Observable<BotInterface[]> = null; 
  public filteredCurrentUserList$: Observable<BotInterface[]> = null; 
  public curUserId: string = null; 
  public userUID: string = this.auth.GetUserId(); 
  public usersRef: any = null;
  // --------------------------------------------------------------
  private simpleSnackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  
  // -------------------------------------------------------------- 
 
  constructor(
    private fb: FormBuilder,
    private readonly ngFireAuth: AngularFireAuth, 
    public auth: AuthService,
    private readonly ngFireStore: AngularFirestore,
    public currentUserSrv: CurrentUserService,  
    private snackBarSrv: MatSnackBar,
    
  ) { }

  ngOnInit(): void {
    
    this.searchFG = this.fb.group({
      user_search: ['', {
        updateOn: 'change' }
      ],
    });
    
     this.usersRef = this.ngFireStore.collection<BotInterface>(`users/${this.userUID}/bots`, 
                ref => ref.orderBy('user_msg'));        
    this.currentUserList$ = this.usersRef.valueChanges({idField: 'UUID'})  
    
    
  }
  onSearchSubmit({ value, valid }: { value: any, valid: boolean }, 
    formDirective: FormGroupDirective){this.searchField = value.user_search ;this.ngOnInit(); this.search();
    
    };
    search() {
      this.usersRef = this.ngFireStore.collection<BotInterface>(`users/${this.userUID}/bots`, 
      ref => ref.where('name','==' ,this.searchField));        
      this.currentUserList$ = this.usersRef.valueChanges({idField: 'UUID'})  
      console.log(this.currentUserList$);
    }

    clearFilters(){
      this.ngOnInit();
    }
  selectUser( user: BotInterface) {
    console.log('<--- SYNC ENTER UserListComponent.selectUser() user: $O', user);
    const userDoc: AngularFirestoreDocument<BotInterface> = 
    this.ngFireStore.doc(`users/${this.userUID}/bots/${user.UUID}`);
    
    this.curUserId = user.UUID;
    this.currentUserSrv.selectCurrentUserDoc({userId: user.UUID, userDoc});
  }
  userNameGet(user: BotInterface): string {
    if (user.my_msg.isEqual(user.user_msg)) {
      return user.name;
    } else {
        return `${user.name}`;
    } 
  }

  userTimeGet(user: BotInterface): string {
    const day = dayjs();
    const currentDate = `${day.format('DD')}.${day.format('MM')}.${day.format('YYYY')}`; 
    return currentDate;
  }
  userTextGet(user: BotInterface): string {
    const day = dayjs();
    const currentDate = `asddasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasasas`; 
    return currentDate;
  }
  private createUserOrderNumber() {
    console.log("<--- SYNC ENTER UserListComponent.createUserOrderNumber() --->");
    
    let db: firebase.firestore.Firestore = null;
    let next_user_number = -1;

    this.ngFireAuth.app
    .then((app: firebase.app.App) => {      
      // console.log('then firebase.app.App app: %O', app);
      db = app.firestore();
      const orderSeedRef = db.collection("user-order-seed").doc("order-number");
      console.log(orderSeedRef);
      return orderSeedRef.get();
    })
    .then((doc: firebase.firestore.DocumentSnapshot) => {
      console.log(doc.data());
      if (doc.exists) {
          console.log("THEN Document data:", doc.data());
          const user_number_obj: any = doc.data();
          return {
            order_number_ref : doc.ref, 
            user_number : user_number_obj.current_value
          };
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    })
    .then((obj: any) => {
      console.log("THEN Current User Order Number:", obj.user_number);
      
      next_user_number = obj.user_number + 1;
      return obj.order_number_ref.update({
        current_value : next_user_number
      });      
    })
    .then((_) => {
      console.log("THEN Current User Order Number has been incremented!", next_user_number);
      this.createUserInDB(next_user_number, db);
    })
    .catch( error => {
      console.log('catch firebase.app.App error: %O', error);
    });    
    
    console.log("<--- SYNC EXIT UserListComponent.createUserOrderNumber() --->");
  }

  private createUserInDB(user_number: number, db: firebase.firestore.Firestore) {
    console.log('<--- SYNC ENTER UserListComponent.createUserInDB() user_number:', user_number );
    
    const zeroDate = new Date('01 Jan 1970 00:00:00 GMT');
    const nowDate = new Date();

    const zero_ts = firebase.firestore.Timestamp.fromDate(zeroDate);
    const now_ts = firebase.firestore.Timestamp.fromDate(nowDate);

    db.collection(`users/${this.userUID}/bots`).add({
      name: `Bot ${user_number}`,
      my_msg: now_ts,
      user_msg: zero_ts, 
  })
  .then((docRef: firebase.firestore.DocumentReference) => {
    console.log("THEN Document written with ID: %s ", docRef.id);
    
    const day = dayjs(nowDate);
  
    const msgID = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 
    const msgFieldName = `${day.format('HH')}${day.format('mm')}${day.format('ss')}.${day.format('SSS')}`;
    console.log(docRef.path);
    return db.collection(`${docRef.path}/messages`)
      .doc(msgID)
      .set({ [msgFieldName] : {
            source: `Bot ${user_number}`,
            text: 'Welcome to our system.'
          }          
      });
  })
  .then((_) => {
    // console.log("THEN Message has been added!");
    this.simpleSnackBarRef =
        this.snackBarSrv.open(`OK: [Bot ${user_number}] has been created!`,
        '', {
        duration: 1500,
        panelClass: 'mat-snack-bar-container_info'
      });
      this.simpleSnackBarRef.afterDismissed()
      .subscribe(
        (res: MatSnackBarDismiss) => { 

        }
      ); 
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
  }

  createUser() {
    console.log('<--- SYNC ENTER UserListComponent.createUser() --->');
    this.createUserOrderNumber();
    console.log('<--- SYNC EXIT UserListComponent.createUser() --->');
  }


  ngOnDestroy() {
    if (this.simpleSnackBarRef != null) {
      this.simpleSnackBarRef.dismiss();
      this.simpleSnackBarRef = null;
    }
  } 
  // ---------------------------eoc -------------------------------------------
}
