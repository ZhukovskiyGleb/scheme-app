import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartsRoutingModule } from './parts-routing.module';
import { PartsListComponent } from './components/parts-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PartsListComponent],
  imports: [
    CommonModule,
    PartsRoutingModule,
    SharedModule
  ]
})
export class PartsModule { }
