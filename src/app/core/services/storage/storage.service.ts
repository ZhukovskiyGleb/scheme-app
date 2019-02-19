import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FireDbService } from '../fire-db/fire-db.service';
import { map, filter, switchMap } from 'rxjs/operators';
import { CurrentUserService } from '../currentUser/current-user.service';
import { StorageModel, IBoxStorage, ICaseStorage } from '../../models/storage-model';
import { registerContentQuery } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: StorageModel;

  private cachedList: IBoxStorage[];

  private maxBoxId: number;

  constructor(private fireDB: FireDbService,
              private currentUser: CurrentUserService) { }

  loadStorage(): Observable<StorageModel> {
    if (this.storage) {
      return of(this.storage);
    }

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
              id: 0,
              title: 'Box 1',
              cases: [
                {id: 0, amount: 5},
                {id: 1, amount: 3}
              ]
            }
          );

          this.storage.addBox(
            {
              id: 1,
              title: 'Box 2',
              cases: [
                {id: 3, amount: 5},
                {id: 6, amount: 3}
              ]
            }
          );

          this.storage.addBox(
            {
              id: 2,
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
              id: 3,
              title: 'Box 4',
              cases: [
                {id: 19, amount: 5},
                {id: 20, amount: 3}
              ]
            }
          );

          this.updateCache();

          this.findMaxId();

          return this.storage;
        }
      )
    );
  }

  updateCache(): void {
    this.cachedList = this.storage.boxList;
  }

  findMaxId(): void {
    this.maxBoxId = 0;
    this.storage.boxList.forEach(
      (box: IBoxStorage) => {
        if (box.id > this.maxBoxId) {
          this.maxBoxId = box.id;
        }
      }
    );
  }

  get nextBoxId(): number {
    this.maxBoxId ++;
    return this.maxBoxId;
  }

  get cache(): IBoxStorage[] {
    return this.cachedList;
  }

  saveStorage(): void
  {
    this.fireDB.setStorage(this.storage, this.currentUser.uid);
  }

  addNewBox(): IBoxStorage {
    if (!this.storage) return null;

    const box: IBoxStorage = {
      id: this.nextBoxId,
      title: 'new',
      cases: []
    };

    this.storage.addBox(box);

    this.updateCache();

    return box;
  }

  removeBoxById(id: number): void {
    this.storage.boxList.forEach(
      (curBox: IBoxStorage, index: number) => {
        if (curBox.id === id) {
          this.storage.boxList.splice(index, 1);
          
          this.updateCache();

          return;
        }
      }
    );
  }

  removeCaseFromBoxById(id: number, curCase: ICaseStorage): void {
    this.storage.boxList.forEach(
      (curBox: IBoxStorage) => {
        if (curBox.id === id) {
          const index: number = curBox.cases.indexOf(curCase);
          if (index >= 0) {
            curBox.cases.splice(index, 1);

            this.updateCache();
          }
          
          return;
        }
      }
    );
  }

  addCaseToBoxById(id: number, curCase: ICaseStorage): void {
    this.storage.boxList.forEach(
      (curBox: IBoxStorage) => {
        if (curBox.id === id) {
          curBox.cases.push(curCase);

          this.updateCache();

          return;
        }
      }
    );
  }
}
