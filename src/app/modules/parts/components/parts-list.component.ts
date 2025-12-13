import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {PaginationComponent} from 'src/app/shared/components/pagination/pagination.component';
import {Subscription} from 'rxjs';
import {PartModel} from 'src/app/core/models/part-model';
import {PartsService} from 'src/app/core/services/parts/parts.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AutoUnsubscribe} from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import {LangRefresher} from 'src/app/shared/decorators/lang-refresh.decorator';
import {ISubtype, IType, TypesService} from 'src/app/core/services/types/types.service';
import {SearchService} from 'src/app/core/services/search/search.service';
import {IPartStorage} from 'src/app/core/models/storage-model';
import {CurrentUserService} from 'src/app/core/services/currentUser/current-user.service';
import {LocalizationService} from "../../../core/services/localization/localization.service";

@Component({
  selector: 'app-parts-list',
  templateUrl: './parts-list.component.html',
  styleUrls: ['./parts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe
@LangRefresher
export class PartsListComponent implements AfterViewInit {
  readonly partsPerPage = 10;
  private paginationSubscription: Subscription;
  private totalPageSubscription: Subscription;
  private collectionSubscription: Subscription;
  private newPartSubscription: Subscription;
  private searchSubscription: Subscription;
  private readySubscription: Subscription;
  
  partsCollection: PartModel[];
  inSearchMode: boolean = false;

  @ViewChild(PaginationComponent) pagination: PaginationComponent;

  constructor(private partsService: PartsService,
              private navigation: Router,
              private typesService: TypesService,
              private changeDetector: ChangeDetectorRef,
              private search: SearchService,
              private route: ActivatedRoute,
              public currentUser: CurrentUserService,
              public loc: LocalizationService) { }

  ngAfterViewInit() {
    this.readySubscription = this.typesService.waitListReady()
    .subscribe(
      () => {
        this.init();
      }
    );
  }

  get isBusy(): boolean {
    return this.partsService.isBusy;
  }

  init(): void {
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

    this.searchSubscription = this.search.searchPartEvent
    .subscribe(this.searchPartByTitle.bind(this));
  }

  updatePagination(partsCount: number): void {    
    const totalPages = Math.ceil(partsCount / this.partsPerPage);
    this.pagination.init(totalPages);
  }

  trackByPartId(index: number, part: IPartStorage): number {
    return part.id;
  }

  updatePartCollection(currentPage: number):void {
    this.partsService.isBusy = true;
    this.inSearchMode = false;
    const start = (currentPage - 1) * this.partsPerPage;
    
    if (this.collectionSubscription) {
      this.collectionSubscription.unsubscribe();
    }
    
    this.collectionSubscription = this.partsService.loadPartsCollection(start, start + this.partsPerPage)
    .subscribe(
      (result: PartModel[]) => {
        this.partsCollection = result;
        this.partsService.isBusy = false;

        this.changeDetector.detectChanges();
      }
    );
  }

  searchPartByTitle(search: string):void {
    if (!search || search.length == 0) {
      this.updatePartCollection(this.pagination.currentPage);
      return;
    }

    this.pagination.currentPage = 1;
    this.partsService.isBusy = true;
    this.inSearchMode = true;
    
    if (this.collectionSubscription) {
      this.collectionSubscription.unsubscribe();
    }

    this.collectionSubscription = this.partsService.searchPartsByTitle(search, this.pagination.totalPages)
    .subscribe(
      (result: PartModel[]) => {
        this.partsCollection = result;
        this.partsService.isBusy = false;

        this.changeDetector.detectChanges();
      }
    );
  }

  getTypeValue(id: number): string {
    if (isNaN(id)) return '';
            
    const type: IType = this.typesService.getTypeById(id);
    
    return type ? type.value : '';
  }

  getSubtypeValue(typeId: number, id: number): string {
    if (isNaN(typeId) || isNaN(id)) return '';
            
    const type: ISubtype = this.typesService.getSubtypeById(typeId, id);

    return type ? type.value : '';
  }

  onTableClick(id: number) {
    this.navigation.navigate(['parts', id])
  }

  onAddPartClick() {
    this.navigation.navigate(['parts', 'new'])
  }

  onCancelSearchClick() {
    this.updatePartCollection(this.pagination.currentPage);
  }

  isAddNewAvailable(): boolean {
      return  !this.inSearchMode 
              && (this.currentUser.isModer);
  }

}
