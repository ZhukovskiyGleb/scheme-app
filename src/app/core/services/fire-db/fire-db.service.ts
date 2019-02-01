import {Injectable, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import { from, Observable, of } from 'rxjs';
import { UserModel } from 'src/app/core/models/user-model';
import { PartModel } from '../../models/part-model';

@Injectable({
  providedIn: 'root'
})
export class FireDbService{

  private db = firebase.firestore();
  private partsCount: number;

  constructor() {
    // this.db.settings({
    //   timestampsInSnapshots: true
    // });
  }

  updateCounters():Promise<void> {
    return this.db.collection('system').doc('counters').get()
    .then(
      (doc) => {
        if (doc.exists) {
          this.partsCount = doc.data().parts;
          return;
        }
      }
    );
  }

  

  private updatePartsCount(count: number): void {
    this.db.collection('system').doc('counters').set({
      parts: this.partsCount
    }, {merge: true});
  }

  get totalParts(): Observable<number> {
    if (this.partsCount)
      return of(this.partsCount);
    return from(this.updateCounters()
    .then(
      () => {
        return this.partsCount;
      }
    ));
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
          return UserModel.create(uid, user.data());
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

  getPartsCollection(start: number, end: number): Observable<PartModel[]> {
    
    if (end > this.partsCount) {
      end = this.partsCount;
    }
    if (start >= end) {
      start = end;
    }

    if (start < 0 && end < 1) {
      console.log(start, end);
      return from(null);
    }

    return from(
      this.db.collection('parts').orderBy('id').where('id', '>=', start).limit(end - start).get()
      .then(
        query => {
          let result: PartModel[] = [];
          query.forEach(doc => {
            result.push(PartModel.create(doc.data()));
          });
          return result;
        }
      )
      .catch (
        (error) => {
          console.log(error);
          return null;
        }
      )
    );
  }
}
