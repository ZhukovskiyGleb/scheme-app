import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  totalPages: number;
  currentPage: number;

  constructor() { }

  ngOnInit() {
    this.totalPages = 2;
    this.currentPage = 3;
  }

}
