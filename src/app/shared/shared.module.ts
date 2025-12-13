import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NamePipe } from './pipes/name.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RightClickDirective } from './directives/right-click.directive';
import { StringCutterPipe } from './pipes/string-cutter.pipe';
import { LoadingModalComponent } from './modal/loading-modal/loading-modal.component';
import { SearchComponent } from './components/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditPartComponent } from './components/edit-part/edit-part.component';

@NgModule({
  declarations: [
    NamePipe,
    PaginationComponent,
    SearchComponent,
    LoadingModalComponent,
    EditPartComponent,
    RightClickDirective,
    StringCutterPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    NamePipe,
    PaginationComponent,
    SearchComponent,
    LoadingModalComponent,
    EditPartComponent,
    RightClickDirective,
    StringCutterPipe
  ]
})
export class SharedModule { }
