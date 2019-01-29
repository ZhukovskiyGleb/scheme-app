import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { FireDbService } from '../fire-db/fire-db.service';
import { CurrentUserService } from '../currentUser/current-user.service';
import { UserModel } from 'src/app/models/user-model';
import { FirebaseService } from '../firebase/firebase.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isLogged: boolean;
  private uid: string;

  constructor(private firebase: FirebaseService,
              private fireDB: FireDbService,
              private currentUser: CurrentUserService) { }

  registerNewUser(email: string, password: string, name: string): Observable<void> {
    return this.firebase.createUserWithEmailAndPassword(email, password)
    .pipe(
      switchMap((userCred: firebase.auth.UserCredential) => {
        this.uid = userCred.user.uid;
        return from(userCred.user.getIdToken());
      }),
      map((token:string) => {
        this.token = token;
        this.isLogged = true;
        return this.uid;
      }),
      switchMap((uid) => {
        return this.fireDB.createNewUser(uid, name);
      }),
      tap(() => {
        this.currentUser.setCurrentUser(new UserModel(name));
      }),
      catchError(error => {
        console.log('AuthService -> registerNewUser -> ', error);
        throw error;
      })
    );
  }

  login(email: string, password: string): Observable<void> {
    return this.firebase.signInWithEmailAndPassword(email, password)
    .pipe(
      switchMap((userCred: firebase.auth.UserCredential) => {
        this.uid = userCred.user.uid;
        return from(userCred.user.getIdToken());
      }),
      map((token:string) => {
        this.token = token;
        this.isLogged = true;
        return this.uid;
      }),
      switchMap((uid) => {
        return this.fireDB.getUserByUid(uid);
      }),
      map( (user: UserModel) => {
        this.currentUser.setCurrentUser(user);
      }),
      catchError((error) => {
        console.log('AuthService -> login -> ', error);
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    return this.firebase.logout()
    .pipe(
      map(() => {
        this.token = null;
        this.isLogged = false;
        this.currentUser.clearCurrentUser();
      }),
      catchError((error) => {
        console.log('AuthService -> logout -> ', error);
        throw error;
      })
    );
  }

  get isUserLogged(): boolean {
    return this.isLogged;
  }
}
