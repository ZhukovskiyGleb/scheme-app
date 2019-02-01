import { Injectable } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { map, tap, switchMap, catchError, take } from 'rxjs/operators';
import { FireDbService } from '../fire-db/fire-db.service';
import { CurrentUserService } from '../currentUser/current-user.service';
import { UserModel } from 'src/app/core/models/user-model';
import { FirebaseService } from '../firebase/firebase.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isLogged = false;

  constructor(private firebase: FirebaseService,
              private fireDB: FireDbService,
              private currentUser: CurrentUserService) { }

  registerNewUser(email: string, password: string, name: string): Observable<void> {
    return this.firebase.createUserWithEmailAndPassword(email, password)
    .pipe(
      switchMap((userCred: firebase.auth.UserCredential) => {
        const uid = userCred.user.uid;
        return from(userCred.user.getIdToken())
        .pipe(
          switchMap((token: string) => {
            this.token = token;
            this.isLogged = true;
            return this.fireDB.createNewUser(uid, name);
          }),
          map(() => {
            return uid;
          })
        );
      }),
      map((uid: string) => {
        this.currentUser.setCurrentUser(new UserModel(uid, name));
        return;
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
        const uid = userCred.user.uid;
        return from(userCred.user.getIdToken())
        .pipe(
          switchMap((token: string) => {
            this.token = token;
            this.isLogged = true;
            return uid;
          })
        );
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

  hasLastUser(): Observable<boolean> {
    return this.firebase.getLastUser()
    .pipe(
      map(user => user ? true : false)
    );
  }

  loadLastUser(): Observable<boolean> {
    return this.firebase.getLastUser()
    .pipe(
      take(1),
      switchMap((user: firebase.User) => {
        if (!user) {
          throw ('no user');
        }
        const uid = user.uid;
        return from(user.getIdToken())
        .pipe(
          map((token: string) => {
            this.token = token;
            this.isLogged = true;
            return uid;
          })
        );
      }),
      switchMap((uid) => {
        return this.fireDB.getUserByUid(uid);
      }),
      map((user: UserModel) => {
        this.currentUser.setCurrentUser(user);
        return true;
      }),
      catchError((error) => {
        if (error == 'no user') {
          return of(false);
        }
        console.log('AuthService -> loadLastUser -> ', error);
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
