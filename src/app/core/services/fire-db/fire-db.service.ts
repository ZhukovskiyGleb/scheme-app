import {Injectable, OnInit} from '@angular/core';
import * as firebase from 'firebase';
import { from, Observable, of } from 'rxjs';
import { UserModel } from 'src/app/core/models/user-model';
import { PartModel } from '../../models/part-model';
import { QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ITypesList } from '../types/types.service';
import { IBoxStorage, StorageModel } from '../../models/storage-model';

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
        throw error;
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
            // this.db.collection('parts').doc(doc.id).set({
            //   ...doc.data(),
            //   search: this.generateSerchWords(doc.data().title)
            // });
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

  searchPartsByTitle(search: string, limit: number): Observable<PartModel[]> {
    const searchWord: string = search.toLowerCase();
    return from(
      // this.db.collection('parts').orderBy('title').startAt(searchWord).endAt(searchWord + "\uf8ff").limit(10).get()
      this.db.collection('parts').where('search', 'array-contains', searchWord).limit(limit).get()
      .then(
        (query: QuerySnapshot<QueryDocumentSnapshot<any>>) => {
          let result: PartModel[] = [];
          query.forEach(
            (doc: QueryDocumentSnapshot<any>) => {
            result.push(PartModel.create(doc.data()));
          });
          return result;
        }
      )
      .catch (
        (error) => {
          console.log('FireDbService -> searchPartsByTitle ->', error);
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
      {
        ...part,
        search: this.generateSerchWords(part.title)
      },
      {merge: true}
    );
  }

  updateTypes(types: ITypesList): void {
    this.db.collection('system').doc('types').set({...types});
  }

  generateSerchWords(title: string): string[] {
    let mainWord:string = title.toLowerCase();
    const result: string[] = [];
    result.push(mainWord);

    let split: string[] = mainWord.split(/-| |\(|\)|_|\\|\//);
    if (split.length > 1) {
      split.forEach(
        value => {
          if(value.length > 0) result.push(value);
        }
      )
      mainWord = split.join('');
      result.push(mainWord);
    }

    let i: number;
    const max: number = Math.min(mainWord.length, 11 - result.length);
    for (i = 1; i < max; i++) {
      result.push(mainWord.substr(0, i));
    }

    return result;
  }

  getStorage(uid: string): Observable<StorageModel> {
    return from(
      this.db.collection('storage').doc(uid).get()
      .then(
        (doc: QueryDocumentSnapshot<any>) => {
          let result: StorageModel = new StorageModel();
          if (doc.exists)
          {
            const storage: IBoxStorage[] = doc.data().boxes;
            storage.forEach(
              (box: IBoxStorage) => {
                result.addBox(box);
              }
            );
          }
          return result;
        }
      ).catch((error) => {
        console.log('FireDbService -> getStorage ->', error);
        return null;
      })
    );
  }

  setStorage(storage: StorageModel, uid: string): void {
    this.db.collection('storage').doc(uid).set(
      {...storage}
    );
  }
}
