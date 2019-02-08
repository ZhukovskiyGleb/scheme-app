import { Component, ViewChild, AfterContentInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { Subscription } from 'rxjs';
import { PartModel } from 'src/app/core/models/part-model';
import { PartsService } from 'src/app/core/services/parts/parts.service';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import { TypesService, IType } from 'src/app/core/services/types/types.service';

@Component({
  selector: 'app-parts-list',
  templateUrl: './parts-list.component.html',
  styleUrls: ['./parts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe
export class PartsListComponent implements AfterContentInit {
  readonly partsPerPage = 10;
  currentPage: number;
  private paginationSubscription: Subscription;
  private totalPageSubscription: Subscription;
  private collectionSubscription: Subscription;
  private newPartSubscription: Subscription;
  
  public partsCollection: PartModel[];
  public isBusy: boolean = true;

  @ViewChild(PaginationComponent) pagination: PaginationComponent;

  constructor(private partsService: PartsService,
              private navigation: Router,
              private typesService: TypesService,
              private changeDetector: ChangeDetectorRef) { }

  ngAfterContentInit() {
    this.paginationSubscription = this.pagination.pageEvent
    .subscribe(this.updatePartCollection.bind(this));

    this.newPartSubscription = this.partsService.newPartAddedEvent
    .subscribe(
      (partsCount: number) => {
        this.updatePagination(partsCount);
      }
    );

    this.totalPageSubscription = this.partsService.totalParts
    .subscribe(
      (partsCount: number) => {
        this.updatePagination(partsCount);
      }
    );
  }

  updatePagination(partsCount: number): void {    
    const totalPages = Math.ceil(partsCount / this.partsPerPage);
    this.pagination.init(totalPages);
  }

  updatePartCollection(currentPage: number):void {
    this.currentPage = currentPage;
    this.isBusy = true;
    const start = (currentPage - 1) * this.partsPerPage;
    
    if (this.collectionSubscription) {
      this.collectionSubscription.unsubscribe();
    }

    this.collectionSubscription = this.partsService.loadPartsCollection(start, start + this.partsPerPage)
    .subscribe(
      (result: PartModel[]) => {
        this.partsCollection = result;
        this.isBusy = false;

        this.changeDetector.detectChanges();
      }
    );
  }

  getTypeValue(id: number): string {
    if (isNaN(id)) return '';
            
    const type: IType = this.typesService.getTypeById(id);

    return type ? type.value : '';
  }

  onTableClick(id: number) {
    this.navigation.navigate(['parts', id])
  }

  onAddPartClick() {
    this.navigation.navigate(['parts', 'new'])
  }

}
