import {  Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserChatComponent implements OnInit {
  
  @Input('data-source') 
    messages: {id: string; src: string; src_name: string; txt: string}[];  
  @Input('user-type') user_type: string;
  constructor() {  } 
  ngOnInit(): void {
   
    console.log('<--- SYNC ENTER UserChatComponent.ngOnInit() messages: %O', this.messages );


  }
  getTextAlign(msg: {id: string; src: string; src_name: string; txt: string}) {
    if (this.user_type==='user') {
      return (msg.src==='user')?'right':'left';
    } else {
      return (msg.src==='user')?'left':'right';
    }
  }
  getUserImage(msg: {id: string; src: string; src_name: string; txt: string}) {
    if (this.user_type==='user') {
      return (msg.src==='user')?'../../../assets/img/user.png':'../../../assets/img/bot.png';
    } else {
      return (msg.src==='user')?'../../../assets/img/bot.png':'../../../assets/img/user.png';
    }
  }
  getBackgroundColors(msg: {id: string; src: string; src_name: string; txt: string}) {
    if (this.user_type==='user') {
      return (msg.src==='user')?'#f5f5f5':'#3c4252';
    } else {
      return (msg.src==='user')?'3c4252':'#f5f5f5';
    }
  }
  getColors(msg: {id: string; src: string; src_name: string; txt: string}) {
    if (this.user_type==='user') {
      return (msg.src==='user')?'black':'white';
    } else {
      return (msg.src==='user')?'white':'black';
    }
  }
}
