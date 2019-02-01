import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  pageEvent = new Subject<number>();

  protected totalPages: number = 1;
  protected currentPage: number = 1;

  constructor() { }

  ngOnInit() {
  }

  init(totalPages): void {
    this.totalPages = totalPages;
  }

  protected onPageClick(event: Event): void {
    const elem: Element = event.srcElement;
    const label = elem.attributes['label'];
    if (label) {
      switch (label.value) {
        case ('prev'):
          if (this.currentPage > 1) {
            this.currentPage --;
          }
          break;
        case ('next'):
          if (this.currentPage < this.totalPages) {
            this.currentPage ++;
          }
          break;
        case ('first'):
          this.currentPage = 1;
          break;
        case ('last'):
          this.currentPage = this.totalPages
          break;
        default:
          return;
      }
      this.pageEvent.next(this.currentPage);
    }
  }

}
