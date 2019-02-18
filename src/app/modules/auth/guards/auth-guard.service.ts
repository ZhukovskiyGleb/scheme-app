import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CurrentUserService } from 'src/app/core/services/currentUser/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService,
              private currentUser: CurrentUserService,
              private navigation: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.hasLastUser()
    .pipe(
      map((user) => {
        if (!user) {
          this.navigation.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
