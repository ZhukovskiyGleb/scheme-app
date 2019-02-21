import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {FireDbService} from './core/services/fire-db/fire-db.service';
import { AuthService } from './core/services/auth/auth.service';
import { CurrentUserService } from './core/services/currentUser/current-user.service';
import { HttpClientModule } from '@angular/common/http';
import { FirebaseService } from './core/services/firebase/firebase.service';
import { ErrorModalService } from './core/services/error-modal/error-modal.service';
import { SharedModule } from './shared/shared.module';
import { PartsService } from './core/services/parts/parts.service';
import { TypesService } from './core/services/types/types.service';

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
    PartsService,
    TypesService,
    CurrentUserService,
    AuthService,
    ErrorModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
