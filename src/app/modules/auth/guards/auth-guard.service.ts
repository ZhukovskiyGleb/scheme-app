import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router} from "@angular/router";
import {Observable, of} from "rxjs";
import { FirebaseService } from 'src/app/services/firebase/firebase.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private firebase: FirebaseService,
              private navigation: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.firebase.hasCurrentUser()) {
      this.navigation.navigate(['/login']);
      return of(false);
    } else {
      return this.firebase.getToken()
      .pipe(
        map((result) => {
          return result ? true : false;
        })
      );
    }
  }
}
