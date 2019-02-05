import { Injectable } from '@angular/core';
import { FireDbService } from '../fire-db/fire-db.service';
import { Observable, of, from } from 'rxjs';
import { PartModel } from '../../models/part-model';
import { map } from 'rxjs/operators';
import { QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private partsCollection: PartModel[];
  private partsCount: number;

  constructor(public fireDB: FireDbService) { }

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

  getPartById(id: number): Observable<PartModel> {
    const part: PartModel = this.partsCollection ?
      this.partsCollection.find((value: PartModel) => value.id === id) :
      null;
    if (part) {
      return of(part);
    }
    return this.fireDB.getPartById(id);
  }

  updatePartById(part: PartModel, id: number): void {
    console.log(part);
    const index = this.partsCollection.findIndex(value => value.id === id);
    if (index) {
      this.partsCollection[index] = part;
    }
    
    this.fireDB.setPartById(part, id);
  }

  addNewPart(part: PartModel): void {
    this.partsCount += 1;

    const id = this.partsCount;

    this.fireDB.setPartById({...part, id: id}, id);

    this.fireDB.updatePartsCount(this.partsCount);
  }
}
