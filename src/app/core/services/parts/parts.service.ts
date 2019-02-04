import { Injectable } from '@angular/core';
import { FireDbService } from '../fire-db/fire-db.service';
import { Observable, of } from 'rxjs';
import { PartModel } from '../../models/part-model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartsService {
  private partsCollection: PartModel[];

  constructor(protected fireDB: FireDbService) { }

  init(): void {
    this.fireDB.updateCounters();
  }

  get totalParts(): Observable<number> {
    if (this.fireDB.partsCount)
      return of(this.fireDB.partsCount);
    return this.fireDB.updateCounters()
    .pipe(
      map(
        () => {
          return this.fireDB.partsCount;
        }
      )
    );
  }

  loadPartsCollection(start: number, end: number): Observable<PartModel[]> {
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
    const id = this.fireDB.partsCount + 1;

    part = {...part, id: id};
    this.fireDB.setPartById(part, id);
  }
}
