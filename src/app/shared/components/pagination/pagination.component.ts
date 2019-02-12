import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() isVisible: boolean = true;
  pageEvent = new Subject<number>();

  public totalPages: number = 1;
  public currentPage: number = 1;

  constructor() { }

  ngOnInit() {
  }

  init(totalPages: number): void {
    this.totalPages = totalPages;
    this.pageEvent.next(this.currentPage);
  }

  public onPageClick(event: Event): void {
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

  prevButtonAvailable():boolean {
     return (this.totalPages > 1 && this.currentPage > 1);
  }
  nextButtonAvailable():boolean {
    return (this.totalPages > 1 && this.currentPage < this.totalPages);
  }
  firstPageAvailable():boolean {
    return this.totalPages > 2 && this.currentPage > 2;
  }
  prevDotsAvailable():boolean {
    return this.totalPages > 3 && this.currentPage > 3;
  }
  prevPageAvailable():boolean {
    return this.totalPages > 1 && this.currentPage > 1;
  }
  currentPageAvailable():boolean {
    return this.totalPages > 0;
  }
  nextPageAvailable():boolean {
    return this.totalPages > 1 && this.currentPage <= this.totalPages - 1;
  }
  nextDotsAvailable():boolean {
    return this.totalPages > 3 && this.currentPage < this.totalPages - 2;
  }
  lastPageAvailable():boolean {
    return this.totalPages > 2 && this.currentPage < this.totalPages - 1;
  }
}
