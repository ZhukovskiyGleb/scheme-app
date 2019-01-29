import { Injectable, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { config, Observable, from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  static config = {
    apiKey: "AIzaSyC_pnixCaDhoahrEnHvhXjtiiD3jkfqxeg",
    authDomain: "workbench-a10ea.firebaseapp.com",
    databaseURL: "https://workbench-a10ea.firebaseio.com",
    projectId: "workbench-a10ea",
    storageBucket: "workbench-a10ea.appspot.com",
    messagingSenderId: "632656283520"
  };

  constructor() { 
    
  }

  init() {
    
  }

  createUserWithEmailAndPassword(email:string, password: string): Observable<firebase.auth.UserCredential> {
    return from(firebase.auth().createUserWithEmailAndPassword(email, password))
    .pipe(
      catchError(this.handleError())
    );
  }

  signInWithEmailAndPassword(email:string, password: string): Observable<firebase.auth.UserCredential> {
    return from(firebase.auth().signInWithEmailAndPassword(email, password))
    .pipe(
      catchError(this.handleError())
    );
  }

  logout(): Observable<void> {
    return from(firebase.auth().signOut())
  }

  hasCurrentUser(): boolean {
    return firebase.auth().currentUser ? true : false;
  }

  getToken(): Observable<string> {
    return from(firebase.auth().currentUser.getIdToken());
  }

  private handleError () {
    return (error: any): Observable<firebase.auth.UserCredential> => {
      switch (error.code) {
            case ('auth/user-not-found'):
              alert('Пользователь не найден');
              break;
            case ('auth/wrong-password'):
            alert('Неверный пароль');
              break;
            case ('auth/invalid-email'):
              alert('Некорректный почтовый адрес');
              break;
            case ('auth/email-already-in-use'):
              alert('Данный почтовый адрес уже используется');
              break;
            default:
          }

        throw error
    };
  }

}
