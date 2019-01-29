import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthGuardService } from './modules/auth/guards/auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', loadChildren: "src/app/modules/home/home.module#HomeModule"},
  {path: 'login', loadChildren: "src/app/modules/auth/auth.module#AuthModule"},
  {path: 'parts', loadChildren: "src/app/modules/parts/parts.module#PartsModule", canActivate: [AuthGuardService]},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
