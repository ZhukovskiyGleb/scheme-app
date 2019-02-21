import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartsRoutingModule } from './parts-routing.module';
import { PartsListComponent } from './components/parts-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PartsListComponent],
  imports: [
    CommonModule,
    PartsRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PartsModule { }
