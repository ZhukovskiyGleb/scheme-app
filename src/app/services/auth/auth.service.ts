import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import { from, Observable, of } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { FireDbService } from '../fire-db/fire-db.service';
import { CurrentUserService } from '../currentUser/current-user.service';
import { UserModel } from 'src/app/models/user-model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isLogged: boolean;
  private uid: string;

  constructor(private fireDB: FireDbService,
              private currentUser: CurrentUserService) { }

  registerNewUser(email: string, password: string, name: string): Observable<boolean> {
    return from(firebase.auth().createUserWithEmailAndPassword(email, password))
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
      map(result => {
        this.currentUser.setCurrentUser(new UserModel(name));
        return result;
      }),
      catchError((error) => {
        console.log('AuthService -> registerNewUser -> ', error);
        throw error;
      })
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return from(firebase.auth().signInWithEmailAndPassword(email, password))
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
        return true;
      }),
      catchError((error) => {
        console.log('AuthService -> login -> ', error);
        throw error;
      })
    );
  }

  get isUserLogged(): boolean {
    return this.isLogged;
  }
}
