import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { StorageListComponent } from './components/storage-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StorageListComponent],
  imports: [
    CommonModule,
    StorageRoutingModule,
    SharedModule
  ]
})
export class StorageModule { }
