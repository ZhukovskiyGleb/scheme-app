import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {FireDbService} from "./services/fire-db/fire-db.service";
import { AuthService } from './services/auth/auth.service';
import { CurrentUserService } from './services/currentUser/current-user.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFirestoreModule,
    CoreModule
  ],
  providers: [FireDbService, CurrentUserService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule{

}
