import {Injectable, OnInit} from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FireDbService implements OnInit{

  private db = firebase.firestore();

  constructor() {
    this.db.settings({
      timestampsInSnapshots: true
    });
  }

  ngOnInit(): void {

  }
}
