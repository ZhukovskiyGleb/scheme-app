import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(private auth: AuthService,
              private navigation: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.hasLastUser()
    .pipe(
      map((user) => {
        if (user) {
          this.navigation.navigate(['/home']);
          return false;
        }
        return true;
      })
    );
  }
}
