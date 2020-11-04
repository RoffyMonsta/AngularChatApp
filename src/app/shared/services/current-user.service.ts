import { Injectable } from '@angular/core';

import { of, Subject, Observable, pipe, BehaviorSubject } from 'rxjs';
import { map, catchError, takeUntil, shareReplay, startWith, tap, take, filter, switchMap } from 'rxjs/operators'; 

// import * as firebase from "firebase/app";
// import { AngularFireAuth } from "@angular/fire/auth";  
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 
import { BotInterface } from 'src/app/shared/model/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  constructor(
  ) { }

  private currentUserDocSub$ = 
      new BehaviorSubject<AngularFirestoreDocument<BotInterface> | null>(null);
  public currentUser$ = this.currentUserDocSub$.asObservable()
        .pipe(
          filter((userDoc: AngularFirestoreDocument<BotInterface>) => userDoc != null), 
          switchMap((userDoc: AngularFirestoreDocument<BotInterface>) => userDoc.valueChanges()),
          map((user: BotInterface) => { 
            user.UUID = this.currentUserId;
            return user;
          }),
          shareReplay(1)
        );

        public currentUser: BotInterface | null = null; 
        public currentUserId: string | null = null; 
  
  selectCurrentUserDoc({userId, userDoc}: {userId:string, userDoc: AngularFirestoreDocument<BotInterface>}) {    

    this.currentUserId = userId;
    this.currentUserDocSub$.next(userDoc);
    console.log('<--- SYNC ENTER selectCurrentUserDoc()) user: Doc',  this.currentUserDocSub$.next(userDoc));
  }

  // ---------------------- eof ----------------------------------------------
}
