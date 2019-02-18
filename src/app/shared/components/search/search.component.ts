import { Component, OnInit, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { PartsService } from 'src/app/core/services/parts/parts.service';
import { SearchService } from 'src/app/core/services/search/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('titleInput') title: ElementRef;
  constructor(private search: SearchService) { }

  ngOnInit() {
  }

  onSearchClick() {
    const input = this.title.nativeElement as HTMLInputElement;
    this.search.searchPartEvent.next(input.value);
  }

}
