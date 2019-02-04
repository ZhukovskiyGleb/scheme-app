import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StorageListComponent } from './components/storage-list.component';

const routes: Routes = [
  {path: '', component: StorageListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
