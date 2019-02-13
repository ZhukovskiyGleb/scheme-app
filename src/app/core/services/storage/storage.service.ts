import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

export interface IPartStorage {
  id: string;
  amount: number;
}

export interface IBoxStorage {
  title: string;
  cases: IPartStorage[];
}


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: IBoxStorage[];

  constructor() { }

  loadStorage(): Observable<IBoxStorage[]> {
    if (this.storage) {
      return of(this.storage);
    }


  }
}
