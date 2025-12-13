import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import { initializeApp } from 'firebase/app';
import {AuthService} from './core/services/auth/auth.service';
import {filter} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {LocalizationService} from "./core/services/localization/localization.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  constructor (private injector: Injector,
               private navigation: Router,
               private router: ActivatedRoute,
               private changeDetector: ChangeDetectorRef,
               public loc: LocalizationService) {
    initializeApp(environment.firebaseConfig);
  }

  ngOnInit() {
    const auth: AuthService = this.injector.get(AuthService);
    auth.loadLastUser()
    .pipe(
      filter(value => !!value)
    )
    .subscribe(() => {
      this.loc.loadUserLanguage();
    });

    this.loc.languageChanged.subscribe(
      () => {
        this.navigation.navigate([this.router.url])
        this.changeDetector.markForCheck();
      }
    );
  }
}
