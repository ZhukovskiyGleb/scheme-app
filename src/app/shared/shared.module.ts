import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NamePipe } from './pipes/name.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RightClickDirective } from './directives/right-click.directive';
import { StringCutterPipe } from './pipes/string-cutter.pipe';
import { LoadingModalComponent } from './modal/loading-modal/loading-modal.component';

@NgModule({
  declarations: [
    NamePipe,
    PaginationComponent,
    RightClickDirective,
    StringCutterPipe,
    LoadingModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NamePipe,
    PaginationComponent,
    RightClickDirective,
    StringCutterPipe,
    LoadingModalComponent
  ]
})
export class SharedModule { }
