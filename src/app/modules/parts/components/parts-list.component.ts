import { Component, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { Subscription } from 'rxjs';
import { PartModel } from 'src/app/core/models/part-model';
import { PartsService } from 'src/app/core/services/parts/parts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parts-list',
  templateUrl: './parts-list.component.html',
  styleUrls: ['./parts-list.component.css']
})
export class PartsListComponent implements OnDestroy, AfterContentInit {
  readonly partsPerPage = 10;
  private paginationSubscription: Subscription;
  
  protected partsCollection: PartModel[];
  protected isBusy: boolean = true;

  @ViewChild(PaginationComponent) pagination: PaginationComponent;

  constructor(private partsService: PartsService,
              private navigation: Router) { }

  ngAfterContentInit() {
    this.partsService.totalParts.subscribe(
      (partsCount: number) => {
        const totalPages = Math.ceil(partsCount / this.partsPerPage);
        this.pagination.init(totalPages);
        this.updatePartCollection(1);
        this.paginationSubscription = this.pagination.pageEvent.subscribe(this.updatePartCollection.bind(this));
      }
    );
  }

  updatePartCollection(currentPage: number):void {
    this.isBusy = true;
    const start = (currentPage - 1) * this.partsPerPage;
    this.partsService.loadPartsCollection(start, start + this.partsPerPage)
    .subscribe(
      (result: PartModel[]) => {
        this.partsCollection = result;
        this.isBusy = false;
      }
    );
  }

  onTableClick(id: number) {
    this.navigation.navigate(['parts', id])
  }

  ngOnDestroy() {
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }

}
