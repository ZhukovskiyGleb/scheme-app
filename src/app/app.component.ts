import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor () {
    firebase.initializeApp({
      apiKey: "AIzaSyC_pnixCaDhoahrEnHvhXjtiiD3jkfqxeg",
      authDomain: "workbench-a10ea.firebaseapp.com",
      databaseURL: "https://workbench-a10ea.firebaseio.com",
      projectId: "workbench-a10ea",
      storageBucket: "workbench-a10ea.appspot.com",
      messagingSenderId: "632656283520"
    });
  }

  ngOnInit() {
    // firebase.auth().signOut();
  }
}
