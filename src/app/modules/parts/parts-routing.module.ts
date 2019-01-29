import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartsListComponent } from './components/parts-list.component';

const routes: Routes = [
  {path: '', component: PartsListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartsRoutingModule { }
