import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartsListComponent } from './components/parts-list.component';
import { EditPartComponent } from './components/edit-part/edit-part.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {path: '', component: PartsListComponent, children: [
    // {path: '', component: null},
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
