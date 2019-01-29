import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CurrentUserService } from 'src/app/services/currentUser/current-user.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public auth: AuthService,
              public currentUser: CurrentUserService,
              private navigation: Router) { }

  ngOnInit() {

  }

  onLogoutClick() {
    this.auth.logout()
    .subscribe(() => {
      this.navigation.navigate(['/home']);
    }, (error) => {
        
      });
  }

}
