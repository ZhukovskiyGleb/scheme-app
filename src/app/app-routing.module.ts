import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthGuardService } from './modules/auth/guards/auth-guard.service';
import { LoginGuardService } from './modules/auth/guards/login-guard.service';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { AdminGuard } from './modules/admin/guards/admin.guard';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)},
  {path: 'login', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule), canActivate: [LoginGuardService]},
  {path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard]},
  {path: 'parts', loadChildren: () => import('./modules/parts/parts.module').then(m => m.PartsModule)},
  {path: 'storage', loadChildren: () => import('./modules/storage/storage.module').then(m => m.StorageModule), canActivate: [AuthGuardService]},
  {path: 'error', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/error', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
