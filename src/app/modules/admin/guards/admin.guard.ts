import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUserService } from 'src/app/core/services/currentUser/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private currentUser: CurrentUserService,
              private navigation: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const isAdmin = this.currentUser.isAdmin;
      if (!isAdmin) {
        this.navigation.navigate(['/home']);
      }
      return isAdmin;
  }
}
