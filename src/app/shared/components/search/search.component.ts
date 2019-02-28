import {ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {SearchService} from 'src/app/core/services/search/search.service';
import {LocalizationService} from "../../../core/services/localization/localization.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {

  @ViewChild('titleInput') title: ElementRef;
  constructor(private search: SearchService,
              public loc: LocalizationService) { }

  ngOnInit() {
  }

  onSearchClick() {
    this.activateSearch();
  }

  @HostListener('document:keypress', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter' && document.activeElement === this.title.nativeElement) {
      this.activateSearch();
    }
  }

  activateSearch(): void {
    const input = this.title.nativeElement as HTMLInputElement;
    if (input.value.length > 0) {
      this.search.searchPartEvent.next(input.value);
    }
  }

}
