import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartsRoutingModule } from './parts-routing.module';
import { PartsListComponent } from './components/parts-list.component';

@NgModule({
  declarations: [PartsListComponent],
  imports: [
    CommonModule,
    PartsRoutingModule
  ]
})
export class PartsModule { }
