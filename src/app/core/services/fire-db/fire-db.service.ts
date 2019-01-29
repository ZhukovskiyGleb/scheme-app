import {Injectable, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import { from, Observable } from 'rxjs';
import { UserModel } from 'src/app/core/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class FireDbService implements OnInit{

  private db = firebase.firestore();

  constructor() {
  }

  ngOnInit(): void {
    this.db.settings({
      timestampsInSnapshots: true
    });
  }

  createNewUser(uid: string, name: string): Observable<void> {
    return from(
      this.db.collection('users').doc(uid).set(
        {
          username: name
        }).catch((error) => {
          console.log('FireDbService -> createNewUser ->', error);
          throw error;
        })
    );
  }

  getUserByUid(uid): Observable<UserModel> {
    return from(
      this.db.collection('users').doc(uid).get()
      .then((user) => {
        if (user.exists) {
          return new UserModel(user.data().username);
        } else {
          console.log('FireDbService -> getUserByUid -> user not found');
          return null;
        }
      }).catch((error) => {
        console.log('FireDbService -> getUserByUid ->', error);
        return null;
      })
    );
  }
}
