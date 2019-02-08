import { Injectable } from '@angular/core';
import { FireDbService } from '../fire-db/fire-db.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe.decorator';

export class ISubtype {
  id: number;
  value: string;
  properties: string[];
}

export class IType {
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

  constructor(private fireDB: FireDbService) {}

  get list(): ITypesList {
    return this.typesList;
  }

  get isReady(): boolean {
    return !!this.typesList;
  }

  waitListReady(): Observable<void> {
    if (this.typesList)
      return of(null);

    return this.fireDB.updateSystem()
    .pipe(
      map(
        (query: QuerySnapshot<QueryDocumentSnapshot<any>>) => {
          query.forEach(
            (doc: QueryDocumentSnapshot<any>) => {
            switch (doc.id) {
              case 'types':
                this.typesList = new ITypesList();
                this.typesList.maxTypeId = doc.data().maxTypeId;
                this.typesList.types = doc.data().types;
                this.typesList.properties = doc.data().properties;
                break;
            }
          });
          return;
        }
      )
    );
  }

  updateTypes(list: ITypesList): void {
    this.typesList = list;
    this.fireDB.updateTypes(this.typesList);
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
