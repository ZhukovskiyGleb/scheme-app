import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, UserCredential } from 'firebase/auth';
import { Observable, from, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PartModel } from '../../models/part-model';
import { generateSearchWords } from '../../shared/generateSearchWorlds';
import { doc, getFirestore, runTransaction } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db = getFirestore();

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
    return from(
      runTransaction(this.db, async (tx) => {

        const countersRef = doc(this.db, 'system', 'counters');
        const countersSnap = await tx.get(countersRef);

        if (!countersSnap.exists()) {
          throw new Error('Counters not found');
        }

        const currentId = countersSnap.data()['parts'];
        const newTotal = currentId + 1;

        const partData = {
          ...part,
          search: generateSearchWords(part.title)
        };

        const partRef = doc(this.db, 'parts', currentId.toString());

        tx.set(countersRef, { parts: newTotal }, { merge: true });
        tx.set(partRef, partData);

        return {
          response: true,
          totalParts: newTotal
        };
      })
    );
  }

}
