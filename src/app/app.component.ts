import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { FirebaseService } from './services/firebase/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor () {
    firebase.initializeApp(FirebaseService.config);
  }

  ngOnInit() {
    
  }
}
