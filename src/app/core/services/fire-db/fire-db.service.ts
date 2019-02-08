import {Injectable, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import { from, Observable, of } from 'rxjs';
import { UserModel } from 'src/app/core/models/user-model';
import { PartModel } from '../../models/part-model';
import { QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ITypesList } from '../types/types.service';

@Injectable({
  providedIn: 'root'
})
export class FireDbService{

  private db = firebase.firestore();

  private systemObservable: Observable<firebase.firestore.QuerySnapshot>;

  constructor() {
    this.updateSystem();
  }

  updateSystem():Observable<firebase.firestore.QuerySnapshot> {
    if (!this.systemObservable) {
      this.systemObservable = from(this.db.collection('system').get());
    }
    return this.systemObservable;
  }

  updatePartsCount(count: number): void {
    this.db.collection('system').doc('counters').set({
      parts: count
    }, {merge: true});
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

  getUserByUid(uid: string): Observable<UserModel> {
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
    return from(
      this.db.collection('parts').orderBy('id').where('id', '>=', start).limit(end - start).get()
      .then(
        (query: QuerySnapshot<QueryDocumentSnapshot<any>>) => {
          let result: PartModel[] = [];
          query.forEach(
            (doc: QueryDocumentSnapshot<any>) => {
            result.push(PartModel.create(doc.data()));

            // this.db.collection('parts').doc(doc.data().id.toString()).set(
            //   {...doc.data(),
            //   owner: this.uid}
            //   );
          });
          return result;
        }
      )
      .catch (
        (error) => {
          console.log('FireDbService -> getPartsCollection ->', error);
          return null;
        }
      )
    );
  }

  getPartById(id: number): Observable<PartModel> {
    return from(
      this.db.collection('parts').where('id', '==', id).limit(1).get()
    .then(
      (query: QuerySnapshot<QueryDocumentSnapshot<any>>) => {
        let part: PartModel;
        query.forEach(
          (doc: QueryDocumentSnapshot<any>) => {
          part = PartModel.create(doc.data());
        });
        return part;
      }
    )
    .catch (
      (error) => {
        console.log('FireDbService -> getPartsCollection ->', error);
        return null;
      }
    )
    );
  }

  setPartById(part: PartModel, id: number): void {
    this.db.collection('parts').doc(id.toString()).set(
      {...part},
      {merge: true}
    );
  }

  updateTypes(types: ITypesList): void {
    this.db.collection('system').doc('types').set({...types});
  }
}
