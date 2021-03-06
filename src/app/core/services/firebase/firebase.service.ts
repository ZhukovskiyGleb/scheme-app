import { Injectable, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { config, Observable, from, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PartModel } from '../../models/part-model';
import { generateSearchWords } from '../../shared/generateSearchWorlds';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor() {

  }

  getLastUser(): Observable<firebase.User> {
    const observer = new Subject<firebase.User>();
    firebase.auth().onAuthStateChanged(observer);
    return observer;
  }

  createUserWithEmailAndPassword(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(firebase.auth().createUserWithEmailAndPassword(email, password))
    .pipe(
      catchError(this.handleError())
    );
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(firebase.auth().signInWithEmailAndPassword(email, password))
    .pipe(
      catchError(this.handleError())
    );
  }

  logout(): Observable<void> {
    return from(firebase.auth().signOut());
  }

  hasCurrentUser(): boolean {
    return firebase.auth().currentUser ? true : false;
  }

  getToken(): Observable<string> {
    return from(firebase.auth().currentUser.getIdToken());
  }

  private handleError () {
    return (error: any): Observable<firebase.auth.UserCredential> => {
      throw error;
    };
  }

  addNewPart(part: PartModel): Observable<any> {
    const addNewPart = firebase.functions().httpsCallable('addNewPart');

    return from(
      addNewPart({
        part: {
          ...part,
          search: generateSearchWords(part.title)
        }
      })
      .then(
        (result: firebase.functions.HttpsCallableResult) => {
          return result.data;
        }
      )
    );
  }

}
