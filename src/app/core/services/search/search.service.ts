import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchPartEvent = new EventEmitter<string>();

  constructor() { }
}
