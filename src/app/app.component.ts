import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Observable } from 'rxjs';
import { map, filter, shareReplay, startWith, tap } from 'rxjs/operators';
import { AuthService } from "./shared/services/auth.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
   
  ],
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    public authService: AuthService
    ) {

  }
 
  ngOnInit() {

    // ----------------- ngOnInit()
  }

}
// --------------------------------------------------------------------------------


