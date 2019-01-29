import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable, of} from "rxjs";
import { AuthService } from 'src/app/services/auth/auth.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private auth:AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!firebase.auth().currentUser) {
      return of(false);
    } else {
      return firebase.auth().currentUser.getIdToken().then((token) => {
        return true;
      }, () => {
        return false;
      })
    }
  }
}
