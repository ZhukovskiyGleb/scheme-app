import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StorageListComponent } from './components/storage-list.component';
import { SearchComponent } from 'src/app/shared/components/search/search.component';
import { EditPartComponent } from 'src/app/shared/components/edit-part/edit-part.component';

const routes: Routes = [
  {path: '', component: StorageListComponent, children: [
    {path: 'new', redirectTo: ''},
    {path: ':id', component: EditPartComponent},
    {path: '**', component: SearchComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
