import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthGuardService } from './modules/auth/guards/auth-guard.service';
import { LoginGuardService } from './modules/auth/guards/login-guard.service';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', loadChildren: "src/app/modules/home/home.module#HomeModule"},
  {path: 'login', loadChildren: "src/app/modules/auth/auth.module#AuthModule", canActivate: [LoginGuardService]},
  {path: 'parts', loadChildren: "src/app/modules/parts/parts.module#PartsModule", canActivate: [AuthGuardService]},
  {path: 'error', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/error', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
