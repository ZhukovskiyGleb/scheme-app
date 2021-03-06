import {EventEmitter, Injectable} from '@angular/core';
import {FireDbService} from '../fire-db/fire-db.service';
import {Observable, of} from 'rxjs';
import {PartModel} from '../../models/part-model';
import {map, switchMap, tap} from 'rxjs/operators';
import {QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {CurrentUserService} from '../currentUser/current-user.service';
import { FirebaseService } from '../firebase/firebase.service';

export interface IPartShortInfo {
  title: string,
  description: string
}

interface InfoCache {
  [key: number]: IPartShortInfo;
}

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  newPartAddedEvent = new EventEmitter<number>();

  public isBusy: boolean = false;

  private partsCollection: PartModel[];
  private partsCount: number;
  private infoCache: InfoCache = {};

  constructor(public fireDB: FireDbService,
              private firebase: FirebaseService,
              private currentUser: CurrentUserService) { }

  get totalParts(): Observable<number> {
    if (this.partsCount) {
      return of(this.partsCount);
    }

    return this.fireDB.updateSystem()
    .pipe(
      map(
        (snapshot: QuerySnapshot<QueryDocumentSnapshot<any>>) => {
          snapshot.forEach(
            (doc: QueryDocumentSnapshot<any>) => {
            switch (doc.id) {
              case 'counters':
                this.partsCount = doc.data().parts;
                break;
            }
          });
          return this.partsCount;
        }
      )
    );
  }

  loadPartsCollection(start: number, end: number): Observable<PartModel[]> {
    if (end > this.partsCount) {
      end = this.partsCount;
    }
    if (start >= end) {
      start = end;
    }

    if (start < 0 || end < 1) {
      this.partsCollection = [];
      return of(this.partsCollection);
    }

    return this.fireDB.getPartsCollection(start, end)
    .pipe(
      map(
        (result: PartModel[]) => {
          this.partsCollection = result;
          return this.partsCollection;
        }
      )
    );
  }

  searchPartsByTitle(title: string, limit: number): Observable<PartModel[]> {
    if (!title || title.length == 0) {
      return of(null);
    }

    return this.fireDB.searchPartsByTitle(title, limit)
    .pipe(
      map(
        (result: PartModel[]) => {
          this.partsCollection = result;
          return result;
        }
      )
    );
  }

  getPartById(id: number): Observable<PartModel> {
    const part: PartModel = this.partsCollection ?
      this.partsCollection.find((value: PartModel) => value.id === id) :
      null;
    if (part) {
      return of(part);
    }
    return this.fireDB.getPartById(id)
  }

  updateCacheForId(part:PartModel, id: number): void {
    this.infoCache[id] = {
      title: part.title,
      description: part.description
    };
  }

  getCachedInfoById(id: number): IPartShortInfo {
    if (this.infoCache[id]) {
      return this.infoCache[id];
    }
    return null;
  }

  getShortInfoById(id: number): Observable<IPartShortInfo> {
    if (this.infoCache[id]) {
      return of(this.infoCache[id]);
    }

    const part: PartModel = this.partsCollection ?
      this.partsCollection.find((value: PartModel) => value.id === id) :
      null;
    if (part) {
      this.updateCacheForId(part, id);
      return of(this.infoCache[id]);
    }

    return this.fireDB.getPartById(id)
    .pipe(
      switchMap(
        (part: PartModel) => {
          this.updateCacheForId(part, id);
          return of(this.infoCache[id]);
        }
      )
    );
  }

  createPartModel(): Observable<PartModel> {
    return of(new PartModel({}));
  }

  updatePartById(part: PartModel, id: number): void {
    if (this.partsCollection) {
      const index = this.partsCollection.findIndex(value => value.id === id);
      if (index) {
        this.partsCollection[index] = part;
      }
    }
    
    this.updateCacheForId(part, id);

    this.fireDB.setPartById(part, id);
  }

  addNewPart(part: PartModel): Observable<any> {
    part.owner = this.currentUser.uid;
    return this.firebase.addNewPart(part)
    .pipe(
      tap(
        (result: Partial<{response: boolean, totalParts: number, reason: string}>) => {
          if (result && result.response) {
            this.partsCount = result.totalParts || this.partsCount;
            this.newPartAddedEvent.emit(this.partsCount);
          }
        }
      )
    );
  }
}
