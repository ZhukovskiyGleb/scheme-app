import { Component, OnInit, Injector } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from './core/services/auth/auth.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FireDbService } from './core/services/fire-db/fire-db.service';
import { PartModel } from './core/models/part-model';
import { PartsService } from './core/services/parts/parts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor (private injector: Injector,
              private navigation: Router) {
    firebase.initializeApp(environment.firebaseConfig);
  }

  ngOnInit() {
    const auth = this.injector.get(AuthService);
    auth.loadLastUser()
    .subscribe((value) => {
      if (value) {
        const partsService = this.injector.get(PartsService);
        partsService.init(); 
      }
      // this.navigation.navigate(['/parts']);
    });
  }
}
