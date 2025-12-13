import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/core/services/auth/auth.service';
import {CurrentUserService} from 'src/app/core/services/currentUser/current-user.service';
import {Router} from '@angular/router';
import {StorageService} from "../../services/storage/storage.service";
import {LocalizationService} from "../../services/localization/localization.service";
import {LangRefresher} from 'src/app/shared/decorators/lang-refresh.decorator';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@LangRefresher
export class HeaderComponent implements OnInit {

  isActivated = false;
  isLangDropdownOpen = false;
  isUserDropdownOpen = false;

  constructor(public auth: AuthService,
              public currentUser: CurrentUserService,
              private navigation: Router,
              public storage: StorageService,
              public loc: LocalizationService,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {

  }

  onLogoutClick() {
    this.auth.logout()
    .subscribe(() => {
      this.changeDetector.markForCheck();
      this.navigation.navigate(['/home']);
    }, (error) => {

      });
  }

  onBurgerClick() {
    this.isActivated = !this.isActivated;
    this.changeDetector.markForCheck();
  }

  closeMenu() {
    this.isActivated = false;
    this.isLangDropdownOpen = false;
    this.isUserDropdownOpen = false;
    this.changeDetector.markForCheck();
  }

  toggleLangDropdown(event: Event) {
    event.stopPropagation();
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
    this.isUserDropdownOpen = false;
  }

  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    this.isLangDropdownOpen = false;
  }

}
