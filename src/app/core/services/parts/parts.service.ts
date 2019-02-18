import { Injectable, EventEmitter } from '@angular/core';
import { FireDbService } from '../fire-db/fire-db.service';
import { Observable, of, from } from 'rxjs';
import { PartModel } from '../../models/part-model';
import { map, switchMap, tap } from 'rxjs/operators';
import { QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { CurrentUserService } from '../currentUser/current-user.service';

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

  private partsCollection: PartModel[];
  private partsCount: number;
  private infoCache: InfoCache = {};

  constructor(public fireDB: FireDbService,
              private currentUser: CurrentUserService) { }

  get totalParts(): Observable<number> {
    if (this.partsCount)
      return of(this.partsCount);

    return this.fireDB.updateSystem()
    .pipe(
      map(
        (query: QuerySnapshot<QueryDocumentSnapshot<any>>) => {
          query.forEach(
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

    if (start < 0 && end < 1) {
      return from(null);
    }
    
    return this.fireDB.getPartsCollection(start, end)
    .pipe(
      map(
        (result: PartModel[]) => {
          this.partsCollection = result;
          return result;
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
    .pipe(
      tap(
        (part: PartModel) => {
          if (!this.partsCollection) {
            this.partsCollection = [];
          }
          this.partsCollection.push(part);
        }
      )
    );
  }

  updateCacheForId(part:PartModel, id: number): void {
    this.infoCache[id] = {
      title: part.title,
      description: part.description
    };
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
    const index = this.partsCollection.findIndex(value => value.id === id);
    if (index) {
      this.partsCollection[index] = part;
    }
    
    this.updateCacheForId(part, id);

    this.fireDB.setPartById(part, id);
  }

  addNewPart(part: PartModel): void {
    const id = this.partsCount;

    this.partsCount += 1;

    part.owner = this.currentUser.uid;
    part.id = id;

    this.fireDB.setPartById(part, id);

    this.fireDB.updatePartsCount(this.partsCount);

    this.newPartAddedEvent.emit(this.partsCount);
  }
}
