import { Component, OnInit, ViewChild, AfterViewInit, AfterContentInit, OnDestroy, ElementRef } from '@angular/core';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { FireDbService } from 'src/app/core/services/fire-db/fire-db.service';
import { Observable, Subscription } from 'rxjs';
import { PartModel } from 'src/app/core/models/part-model';

@Component({
  selector: 'app-parts-list',
  templateUrl: './parts-list.component.html',
  styleUrls: ['./parts-list.component.css']
})
export class PartsListComponent implements OnDestroy, AfterContentInit {
  readonly partsPerPage = 10;
  private paginationSubscription: Subscription;
  protected partsCollection: Observable<PartModel[]>;

  @ViewChild(PaginationComponent) pagination: PaginationComponent;

  constructor(protected fireDB: FireDbService) { }

  ngAfterContentInit() {
    this.fireDB.totalParts.subscribe(
      (partsCount: number) => {
        const totalPages = Math.ceil(partsCount / this.partsPerPage);
        this.pagination.init(totalPages);
        this.updatePartCollection(1);
        this.paginationSubscription = this.pagination.pageEvent.subscribe(this.updatePartCollection.bind(this));
      }
    );
  }

  updatePartCollection(currentPage: number):void {
    const start = (currentPage - 1) * this.partsPerPage;
    this.partsCollection = this.fireDB.getPartsCollection(start, start + this.partsPerPage);
  }

  onTableClick(event: Event) {
    console.log(event.currentTarget);
  }

  ngOnDestroy() {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

}
