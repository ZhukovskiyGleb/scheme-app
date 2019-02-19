import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { StorageListComponent } from './components/storage-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewCaseComponent } from './components/new-case/new-case.component';
import { DeleteConfirmComponent } from './components/delete-confirm/delete-confirm.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StorageListComponent, NewCaseComponent, DeleteConfirmComponent],
  imports: [
    CommonModule,
    StorageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class StorageModule { }
