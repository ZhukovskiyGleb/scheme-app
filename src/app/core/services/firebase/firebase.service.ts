import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, UserCredential } from 'firebase/auth';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { Observable, from, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PartModel } from '../../models/part-model';
import { generateSearchWords } from '../../shared/generateSearchWorlds';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor() {

  }

  getLastUser(): Observable<User | null> {
    const observer = new Subject<User | null>();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => observer.next(user));
    return observer;
  }

  createUserWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
    const auth = getAuth();
    return from(createUserWithEmailAndPassword(auth, email, password))
    .pipe(
      catchError(this.handleError())
    );
  }

  signInWithEmailAndPassword(email: string, password: string): Observable<UserCredential> {
    const auth = getAuth();
    return from(signInWithEmailAndPassword(auth, email, password))
    .pipe(
      catchError(this.handleError())
    );
  }

  logout(): Observable<void> {
    const auth = getAuth();
    return from(signOut(auth));
  }

  hasCurrentUser(): boolean {
    const auth = getAuth();
    return auth.currentUser ? true : false;
  }

  getToken(): Observable<string> {
    const auth = getAuth();
    return from(auth.currentUser!.getIdToken());
  }

  private handleError () {
    return (error: any): Observable<UserCredential> => {
      throw error;
    };
  }

  addNewPart(part: PartModel): Observable<any> {
    const functions = getFunctions();
    const addNewPartFn = httpsCallable(functions, 'addNewPart');

    return from(
      addNewPartFn({
        part: {
          ...part,
          search: generateSearchWords(part.title)
        }
      })
      .then(
        (result: HttpsCallableResult) => {
          return result.data;
        }
      )
    );
  }

}
