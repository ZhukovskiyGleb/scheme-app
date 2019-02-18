import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { Observable, of } from 'rxjs';
import { FireDbService } from '../fire-db/fire-db.service';
import { map, filter, switchMap } from 'rxjs/operators';
import { CurrentUserService } from '../currentUser/current-user.service';
import { StorageModel } from '../../models/storage-model';
=======
import { Observable, Subject, of } from 'rxjs';

export interface IPartStorage {
  id: string;
  amount: number;
}

export interface IBoxStorage {
  title: string;
  cases: IPartStorage[];
}

>>>>>>> de6bffe5508e7b05fe0521649e1509a8a06f18bf

@Injectable({
  providedIn: 'root'
})
export class StorageService {

<<<<<<< HEAD
  private storage: StorageModel;

  constructor(private fireDB: FireDbService,
              private currentUser: CurrentUserService) { }

  loadStorage(): Observable<StorageModel> {
=======
  private storage: IBoxStorage[];

  constructor() { }

  loadStorage(): Observable<IBoxStorage[]> {
>>>>>>> de6bffe5508e7b05fe0521649e1509a8a06f18bf
    if (this.storage) {
      return of(this.storage);
    }

<<<<<<< HEAD
    return this.currentUser.isUserLogged
    .pipe(
      filter(
        (result: boolean) => result
      ),
      switchMap(
        () => {
          return this.fireDB.getStorage(this.currentUser.uid);
        }
      ),
      map(
        (storage: StorageModel) => {
          this.storage = storage;

          this.storage.addBox(
            {
              title: 'Box 1',
              cases: [
                {id: 0, amount: 5},
                {id: 1, amount: 3}
              ]
            }
          );

          this.storage.addBox(
            {
              title: 'Box 2',
              cases: [
                {id: 3, amount: 5},
                {id: 6, amount: 3}
              ]
            }
          );

          this.storage.addBox(
            {
              title: 'Box 3',
              cases: [
                {id: 10, amount: 5},
                {id: 11, amount: 1},
                {id: 12, amount: 3},
                {id: 13, amount: 2},
                {id: 14, amount: 7},
                {id: 15, amount: 5},
              ]
            }
          );

          this.storage.addBox(
            {
              title: 'Box 4',
              cases: [
                {id: 19, amount: 5},
                {id: 20, amount: 3}
              ]
            }
          );

          return this.storage;
        }
      )
    );
  }

  saveStorage(): void
  {
    this.fireDB.setStorage(this.storage, this.currentUser.uid);
=======

>>>>>>> de6bffe5508e7b05fe0521649e1509a8a06f18bf
  }
}
