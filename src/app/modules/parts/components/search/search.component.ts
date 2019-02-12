import { Component, OnInit, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { PartsService } from 'src/app/core/services/parts/parts.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @ViewChild('titleInput') title: ElementRef;
  constructor(private partsService: PartsService) { }

  ngOnInit() {
  }

  onSearchClick() {
    const input = this.title.nativeElement as HTMLInputElement;
    this.partsService.searchPartEvent.next(input.value);
  }

}
