import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StorageListComponent } from './components/storage-list.component';
import { SearchComponent } from 'src/app/shared/components/search/search.component';

const routes: Routes = [
  {path: '', component: StorageListComponent, children: [
    {path: '**', component: SearchComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
