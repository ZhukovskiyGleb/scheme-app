import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/core/models/user-model';
import { Subject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private userLoggedSubject = new Subject<boolean>();
  private user: UserModel;

  constructor() { }

  setCurrentUser(user: UserModel) {
    this.user = user;
    this.userLoggedSubject.next(true);
  }

  clearCurrentUser(): void {
    this.user = null;
    this.userLoggedSubject.next(false);
  }

  get userName(): string {
    return this.user ? this.user.username : '';
  }

  get uid(): string {
    return this.user ? this.user.uid : '';
  }

  get isAdmin(): boolean {
    return this.user ? this.user.admin : false;
  }

  get isUserLogged(): Observable<boolean> {
    if (!!this.user) {
      return of(true);
    }
    return this.userLoggedSubject;
  }
}
