import { Timestamp } from 'rxjs/internal/operators/timestamp';

export class User {
    uid: string;
    email: string;
}
export interface BotInterface{
    UUID: string;
    name: string;
    my_msg: firebase.firestore.Timestamp;
    user_msg: firebase.firestore.Timestamp;
}