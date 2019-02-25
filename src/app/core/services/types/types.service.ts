import {Injectable} from '@angular/core';
import {FireDbService} from '../fire-db/fire-db.service';
import {Observable, of} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {AutoUnsubscribe} from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { resolve } from 'url';

export interface ISubtype {
  id: number;
  value: string;
  properties: string[];
}

export interface IType {
  id: number;
  value: string; 
  maxSubtypeId: number;
  subtypes: ISubtype[];
  properties: string[];
}

export class ITypesList {
  maxTypeId: number;
  types: IType[];
  properties: string[];
}

interface TypeDict {
  [id: number]: IType;
}

interface SubtypeDict {
  [id: string]: ISubtype;
}

@Injectable({
  providedIn: 'root'
})
@AutoUnsubscribe
export class TypesService {

  private typesList: ITypesList;

  private typesCache: TypeDict = {};
  private subtypesCache: SubtypeDict = {};

  private propertiesListCache: string[];

  constructor(private fireDB: FireDbService,
              private http: HttpClient) {}

  // testFunction(): void {
  //   let headers = new HttpHeaders();
  //   headers.set('parameter-name', 'parameter-value');
  //   headers.set('Access-Control-Allow-Origin', '*');

  //   this.http.get('https://us-central1-workbench-a10ea.cloudfunctions.net/addMessage.json', {headers: headers})
  //   .subscribe(
  //     (res: Response) => {
  //       console.log(res);
  //     }
  //   );
  // }

  get list(): ITypesList {
    return this.typesList;
  }

  get isReady(): boolean {
    return !!this.typesList;
  }

  waitListReady(): Observable<void> {
    if (this.typesList) {
      return of(null);
    }

    return this.fireDB.updateSystem()
    .pipe(
      map(
        (snapshot: QuerySnapshot<QueryDocumentSnapshot<any>>) => {
          
          snapshot.forEach(
            (doc: QueryDocumentSnapshot<any>) => {
            switch (doc.id) {
              case 'types':
              this.parseTypes(doc.data());
                break;
            }
          });
          return;
        }
      )
    );
  }

  parseTypes(data: any): void  {
    this.typesList = new ITypesList();
    this.typesList.maxTypeId = data.maxTypeId;
    this.typesList.types = data.types;
    this.typesList.properties = data.properties;
  }

  updateTypes(list: ITypesList): void {
    this.typesList = list;
    this.fireDB.updateTypes(this.typesList);

    this.typesCache = {};
    this.subtypesCache = {};
    this.propertiesListCache = [];
  }

  deleteTypeCacheById(id: number): void {
    if (this.typesCache[id]) {
      delete this.typesCache[id];
    }
  }

  getTypeById(id: number): IType {
    if (!id || !this.typesList) return null;

    if (!this.typesCache[id]) {
      this.typesCache[id] = this.typesList.types.find(
        (type: IType) => {
          return type.id === +id;
        }
      );
    }

    return this.typesCache[id];
  }

  deleteSubtypeCacheById(typeId: number, id: number): void {
    const comboId: string = typeId.toString() + '_' + id.toString();
    if (this.subtypesCache[comboId]) {
      delete this.subtypesCache[comboId];
    }
  }

  getSubtypeById(typeId: number, id: number): ISubtype {
    if (!typeId || !id || !this.typesList) return null;

    const type: IType = this.getTypeById(typeId);

    if (!type) return null;

    const comboId: string = typeId.toString() + '_' + id.toString();
    
    if (!this.subtypesCache[comboId]) {
      this.subtypesCache[comboId] = type.subtypes.find(
        (subtype: ISubtype) => {
          return subtype.id === +id;
        }
      );
    }

    return this.subtypesCache[comboId];
  }

  getAvailableTypes(): IType[] {
    return this.typesList ? this.typesList.types : [];
  }

  getAvailableSubtypes(typeId: number): ISubtype[] {
    if (!this.typesList) return [];
    
    const type: IType = this.getTypeById(typeId);

    return !type ?
    [] :
    type.subtypes;
  }

  deletePropertiesListCache(): void {
    this.propertiesListCache = null;
  }

  getAvailableProperties(typeId: number = undefined, subtypeId: number = undefined): string[] {
    if (!this.propertiesListCache && this.typesList) {
      this.propertiesListCache = [];
      this.typesList.properties.forEach(
        (property: string) => {
          this.propertiesListCache.push(property);
        }
      );

      const type: IType = this.getTypeById(typeId);
      if (type) {
        
        type.properties.forEach(
          (property: string) => {
            this.propertiesListCache.push(property);
          }
        );

        const subtype: ISubtype = this.getSubtypeById(typeId, subtypeId);
        if (subtype) {
          subtype.properties.forEach(
            (property: string) => {
              this.propertiesListCache.push(property);
            }
          );
        }
      }
    }
    
    return this.propertiesListCache || [];
  }

}
