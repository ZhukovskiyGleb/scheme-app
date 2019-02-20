import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CurrentUserService } from 'src/app/core/services/currentUser/current-user.service';
import { Router } from '@angular/router';
import {StorageService} from "../../services/storage/storage.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isActivated = false;

  constructor(public auth: AuthService,
              public currentUser: CurrentUserService,
              private navigation: Router,
              public storage: StorageService) { }

  ngOnInit() {

  }

  onLogoutClick() {
    this.auth.logout()
    .subscribe(() => {
      this.navigation.navigate(['/home']);
    }, (error) => {

      });
  }

  onBurgerClick() {
    this.isActivated = ! this.isActivated;
  }

}
