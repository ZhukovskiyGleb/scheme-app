import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartsListComponent } from './components/parts-list.component';
import { EditPartComponent } from './components/edit-part/edit-part.component';

const routes: Routes = [
  {path: '', component: PartsListComponent, children: [
    {path: '', component: null},
    {path: ':id', component: EditPartComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartsRoutingModule { }
