import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from "./core/core.module";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {FireDbService} from "./services/fire-db/fire-db.service";
import { AuthService } from './services/auth/auth.service';
import { CurrentUserService } from './services/currentUser/current-user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptorService } from './interceptors/error-interceptor.service';
import { FirebaseService } from './services/firebase/firebase.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFirestoreModule,
    CoreModule
  ],
  providers: [
    FirebaseService,
    FireDbService,
    CurrentUserService,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule{

}
