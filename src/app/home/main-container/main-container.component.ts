import {Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';
import { MatSnackBar, SimpleSnackBar, MatSnackBarRef,
  MatSnackBarDismiss} from '@angular/material/snack-bar';

import { BotInterface, User } from 'src/app/shared/model/user';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 
import * as dayjs from 'dayjs';
@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainContainerComponent implements OnInit, OnDestroy {
  public statusClass1 = 'active';
  public statusClass2 = 'not-active';

  public curUser$: Observable<BotInterface|null> = null; 
  public curUser: BotInterface | null = null; 
  public userUID: string = null; 
  
  public curUserMsg$: Observable<{
    [x: string]: {
        source: string;
        text: string;
    };
    
  }> = null;
  // --------------------------------------------------------------
  private simpleSnackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  
  // -------------------------------------------------------------- 
  constructor(
    private readonly ngFireStore: AngularFirestore,
    public afs: AuthService,
    public currentUserSrv: CurrentUserService,
    private snackBarSrv: MatSnackBar,
  ) { }
  ngOnInit(): void {
    
    this.userUID =  this.afs.GetUserId();
    this.curUser$ = this.currentUserSrv.currentUser$
    .pipe(
      filter((user: BotInterface) => user != null ),
      tap((user: BotInterface) => {
        
        console.log('\tPIPE: MainContainerComponent.ngOnInit().tap user: %O', user); 
        this.curUser = user;
        
      })
    );

    this.curUserMsg$ = this.currentUserSrv.currentUser$
    .pipe(
      filter((user: BotInterface) => user != null),
      switchMap((user: BotInterface) => {
         console.log('\tPIPE: MainContainerComponent.ngOnInit().switchMap user: %O', user); 
        
        const day = dayjs();
        const msgID = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 
    
        const userMsgDoc: AngularFirestoreDocument<{ 
            [x: string]: { source: string; text: string; }
          }> = this.ngFireStore.doc(`users/${this.userUID}/bots/${this.curUser.UUID}/messages/${msgID}`);
        
        return  userMsgDoc.valueChanges();
      }),
      tap((x) => {
        console.log('\tPIPE: MainContainerComponent.ngOnInit().tap userMsgObj: %O', x); 
        if (!x) {
          this.simpleSnackBarRef = this.snackBarSrv.open(`WARNING: there are no current messages!`,
            '', {
            duration: 1500,
            panelClass: 'mat-snack-bar-container_err'
            }); 
        }
      })
    );   

  }
  setActiveClass(){

    if(this.statusClass1 === 'active')this.statusClass1 =  'not-active'; else this.statusClass1 = 'active';
    if(this.statusClass2 === 'not-active')this.statusClass2 =  'active'; else this.statusClass2 = 'not-active';
    
  }
  ngOnDestroy() {
    if (this.simpleSnackBarRef != null) {
      this.simpleSnackBarRef.dismiss();
      this.simpleSnackBarRef = null;
    }
  } 

// ---------------------------------------
}
