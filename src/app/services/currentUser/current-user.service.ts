import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private user: UserModel;

  constructor() { }

  setCurrentUser(user:UserModel) {
    this.user = user;
  }

  get userName(): string {
    return this.user.username;
  }
}
