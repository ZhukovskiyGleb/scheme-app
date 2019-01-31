import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NamePipe } from './pipes/name.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [
    NamePipe,
    PaginationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NamePipe,
    PaginationComponent
  ]
})
export class SharedModule { }
