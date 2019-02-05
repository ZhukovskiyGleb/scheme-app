import { Injectable } from '@angular/core';
import { FireDbService } from '../fire-db/fire-db.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';

export class ISubtype {
  value: string;
  properties: string[];
}

export class IType {
  value: string; 
  subtypes: ISubtype[];
  properties: string[];
}

export class ITypes {
  types: IType[];
  properties: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  private list: ITypes;

  constructor(private fireDB: FireDbService) {}

  get typesList(): Observable<ITypes> {
    if (this.list)
      return of(this.list);

      return this.fireDB.updateSystem()
      .pipe(
        map(
          (query: QuerySnapshot<QueryDocumentSnapshot<any>>) => {
            query.forEach(
              (doc: QueryDocumentSnapshot<any>) => {
              switch (doc.id) {
                case 'types':
                  this.list = new ITypes();
                  this.list.types = doc.data().types;
                  this.list.properties = doc.data().properties;
                  break;
              }
            });
            return this.list;
          }
        )
      );
  }

  updateTypes(list: ITypes): void {
    this.list = list;
    this.fireDB.updateTypes(list);
  }

}
