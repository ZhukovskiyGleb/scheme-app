import {Injectable} from '@angular/core';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, orderBy, where, limit, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import {from, Observable} from 'rxjs';
import {UserModel} from 'src/app/core/models/user-model';
import {PartModel} from '../../models/part-model';
import {ITypesList} from '../types/types.service';
import {IBoxStorage, StorageModel} from '../../models/storage-model';
import { generateSearchWords } from '../../shared/generateSearchWorlds';

@Injectable({
  providedIn: 'root'
})
export class FireDbService{

  private db = getFirestore();

  private systemObservable: Observable<any> | null = null;

  constructor() {
    this.updateSystem();
  }

  updateSystem():Observable<any> {
    if (!this.systemObservable) {
       this.systemObservable = from(getDocs(collection(this.db, 'system')));
    }
    return this.systemObservable;
  }

  createNewUser(uid: string, name: string): Observable<void> {
    return from(
      setDoc(doc(this.db, 'users', uid), {
        username: name
      }).catch((error) => {
        console.log('FireDbService -> createNewUser ->', error);
        throw error;
      })
    );
  }

  getUserByUid(uid: string): Observable<UserModel | null> {
    return from(
      getDoc(doc(this.db, 'users', uid))
      .then((user) => {
        if (user.exists()) {
          return UserModel.create(uid, user.data());
        } else {
          console.log('FireDbService -> getUserByUid -> user not found');
          return null;
        }
      }).catch((error) => {
        console.log('FireDbService -> getUserByUid ->', error);
        throw error;
      })
    );
  }

  saveUserLanguage(uid: string, language: string): Observable<void> {
    return from(
      setDoc(doc(this.db, 'users', uid), { language }, { merge: true })
      .catch((error) => {
        console.log('FireDbService -> saveUserLanguage ->', error);
        throw error;
      })
    );
  }

  getUserLanguage(uid: string): Observable<string | null> {
    return from(
      getDoc(doc(this.db, 'users', uid))
      .then((user) => {
        if (user.exists()) {
          const data = user.data();
          return data['language'] || null;
        }
        return null;
      }).catch((error) => {
        console.log('FireDbService -> getUserLanguage ->', error);
        return null;
      })
    );
  }

  getPartsCollection(start: number, end: number): Observable<PartModel[] | null> {
    return from(
      getDocs(query(collection(this.db, 'parts'), orderBy('id'), where('id', '>=', start), limit(end - start)))
      .then(
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          let result: PartModel[] = [];
          querySnapshot.forEach(
            (docSnap: QueryDocumentSnapshot<DocumentData>) => {
            result.push(PartModel.create(docSnap.data()));
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

  searchPartsByTitle(search: string, limitCount: number): Observable<PartModel[] | null> {
    const searchWord: string = search.toLowerCase();
    return from(
      getDocs(query(collection(this.db, 'parts'), orderBy('title'), where('search', 'array-contains', searchWord), limit(limitCount)))
      .then(
        (querySnapshot: QuerySnapshot<DocumentData>) => {
          let result: PartModel[] = [];
          querySnapshot.forEach(
            (docSnap: QueryDocumentSnapshot<DocumentData>) => {
            result.push(PartModel.create(docSnap.data()));
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

  getPartById(id: number): Observable<PartModel | null> {
    return from(
      getDocs(query(collection(this.db, 'parts'), where('id', '==', id), limit(1)))
    .then(
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        let part: PartModel | null = null;
        querySnapshot.forEach(
          (docSnap: QueryDocumentSnapshot<DocumentData>) => {
          part = PartModel.create(docSnap.data());
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
    setDoc(doc(this.db, 'parts', id.toString()), {
      ...part,
      search: generateSearchWords(part.title)
    }, {merge: true});
  }

  updateTypes(types: ITypesList): void {
    setDoc(doc(this.db, 'system', 'types'), {...types});
  }

  getStorage(uid: string): Observable<StorageModel | null> {
    return from(
      getDoc(doc(this.db, 'storage', uid))
      .then(
        (docSnap) => {
          let result: StorageModel = new StorageModel();
          if (docSnap.exists())
          {
            const storage: IBoxStorage[] = docSnap.data()['boxes'];
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
    setDoc(doc(this.db, 'storage', uid), {...storage});
  }
}
