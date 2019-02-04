import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NamePipe } from './pipes/name.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RightClickDirective } from './directives/right-click.directive';
import { StringCutterPipe } from './pipes/string-cutter.pipe';

@NgModule({
  declarations: [
    NamePipe,
    PaginationComponent,
    RightClickDirective,
    StringCutterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NamePipe,
    PaginationComponent,
    RightClickDirective,
    StringCutterPipe
  ]
})
export class SharedModule { }
