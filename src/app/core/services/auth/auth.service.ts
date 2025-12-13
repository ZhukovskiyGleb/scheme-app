import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import {map, tap, switchMap, catchError, take, filter} from 'rxjs/operators';
import { FireDbService } from '../fire-db/fire-db.service';
import { CurrentUserService } from '../currentUser/current-user.service';
import { UserModel } from 'src/app/core/models/user-model';
import { FirebaseService } from '../firebase/firebase.service';
import { User, UserCredential } from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private isLogged = false;

  constructor(private firebase: FirebaseService,
              private fireDB: FireDbService,
              private currentUser: CurrentUserService) { }

  registerNewUser(email: string, password: string, name: string): Observable<void> {
    return this.firebase.createUserWithEmailAndPassword(email, password)
    .pipe(
      switchMap((userCred: UserCredential) => {
        const uid = userCred.user!.uid;
        return from(userCred.user!.getIdToken())
        .pipe(
          switchMap((token: string) => {
            this.token = token;
            return this.fireDB.createNewUser(uid, name);
          }),
          map(() => {
            return uid;
          })
        );
      }),
      map((uid: string) => {
        this.currentUser.setCurrentUser(new UserModel(uid, name));
        this.isLogged = true;
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
      switchMap((userCred: UserCredential) => {
        const uid = userCred.user!.uid;
        return from(userCred.user!.getIdToken())
        .pipe(
          map((token: string) => {
            this.token = token;
            return uid;
          })
        );
      }),
      switchMap((uid: string) => {
        return this.fireDB.getUserByUid(uid);
      }),
      map( (user: UserModel | null) => {
        if (!!user) {
          this.currentUser.setCurrentUser(user);
          this.isLogged = true;
        }
        else {
          throw ({code: 'auth/user-not-found'});
        }
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
      switchMap((user: User | null) => {
        if (!user) {
          throw ('no user');
        }
        const uid = user.uid;
        return from(user.getIdToken())
        .pipe(
          map((token: string) => {
            this.token = token;
            return uid;
          })
        );
      }),
      switchMap((uid: string) => {
        return this.fireDB.getUserByUid(uid);
      }),
      map((user: UserModel | null) => {
        if (!!user) {
          this.currentUser.setCurrentUser(user);
          this.isLogged = true;
          return true;
        }
        else {
          this.logout();
          return false;
        }
      }),
      catchError((error) => {
        if (error === 'no user') {
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
}
