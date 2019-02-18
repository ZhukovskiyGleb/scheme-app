import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartsListComponent } from './components/parts-list.component';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { EditPartComponent } from './components/edit-part/edit-part.component';

const routes: Routes = [
  {path: '', component: PartsListComponent, children: [
    {path: ':id', component: EditPartComponent},
    {path: 'new', component: EditPartComponent},
    {path: '**', component: SearchComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartsRoutingModule { }
