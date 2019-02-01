import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NamePipe } from './pipes/name.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RightClickDirective } from './directives/right-click.directive';

@NgModule({
  declarations: [
    NamePipe,
    PaginationComponent,
    RightClickDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NamePipe,
    PaginationComponent,
    RightClickDirective
  ]
})
export class SharedModule { }
