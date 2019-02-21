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

  private isChanged: boolean = false;

  constructor(private fireDB: FireDbService,
              private currentUser: CurrentUserService) { }

  loadStorage(refresh: boolean): Observable<StorageModel> {
    this.isChanged = false;

    if (this.storage && !refresh) {
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
    this.isChanged = false;
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

  markAsChanged(): void {
    this.isChanged = true;
  }

  hasChanges(): boolean {
    return this.isChanged;
  }
}
