import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {StorageService} from 'src/app/core/services/storage/storage.service';
import {Observable, Subscription} from 'rxjs';
import {IBoxStorage, ICaseStorage, StorageModel} from 'src/app/core/models/storage-model';
import {AutoUnsubscribe} from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import {map, tap} from 'rxjs/operators';
import {CurrentUserService} from 'src/app/core/services/currentUser/current-user.service';
import {IPartShortInfo, PartsService} from 'src/app/core/services/parts/parts.service';
import {Router} from '@angular/router';
import {SearchService} from 'src/app/core/services/search/search.service';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe
export class StorageListComponent implements OnInit, OnDestroy {
  boxList: IBoxStorage[];

  selectedBox: IBoxStorage;
  selectedCase: ICaseStorage;

  isBusy: boolean = false;
  isWarningVisibility: boolean = false;
  isAddingNewCaseVisibility: boolean = false;
  inSearchMode: boolean = false;

  private storageSubscription: Subscription;
  private searchSubscription: Subscription;

  constructor(private currentUser: CurrentUserService,
              private navigation: Router,
              private storage: StorageService,
              private partsService: PartsService,
              private changeDetector: ChangeDetectorRef,
              private search: SearchService) { }

  ngOnInit() {
    this.loadStorage();

    this.searchSubscription = this.search.searchPartEvent
    .subscribe(this.searchPartByTitle.bind(this));
  }

  loadStorage(refresh: boolean = false):void {
    this.isBusy = true;

    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }

    this.storageSubscription = this.storage.loadStorage(refresh)
    .pipe(
      tap(
        (storage:StorageModel) => {
          this.boxList = storage.boxList;

          this.isBusy = false;
          this.changeDetector.detectChanges();
        }
      )
    )
    .subscribe();
  }

  onCancelSearchClick(): void {
    this.inSearchMode = false;

    this.loadStorage();
  }

  searchPartByTitle(search: string):void {
    if (!search || search.length <= 0) {
      this.onCancelSearchClick();

      return;
    }

    this.isBusy = true;

    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }

    search = search.toLowerCase();
    this.inSearchMode = true;

    const searchResult: IBoxStorage[] = [];
    this.storage.cache.forEach(
      (curBox: IBoxStorage) => {
        let newBox: IBoxStorage = {
          id: curBox.id,
          title: curBox.title,
          cases: []
        };

        if (curBox.title.toLowerCase().search(search) >= 0) {
          newBox.cases = [...curBox.cases];
        }
        else {
          let cases: ICaseStorage[] = curBox.cases;
          cases.forEach(
            (curCase: ICaseStorage) => {
              let info: IPartShortInfo = this.partsService.getCachedInfoById(curCase.id);
              if (info && info.title.toLowerCase().search(search) >= 0) {
                newBox.cases.push(curCase);
              }
            }
          );
        }

        if (newBox.cases.length > 0) {
          searchResult.push(newBox);
        }
      }
    );

    this.boxList = searchResult;

    this.isBusy = false;
  }

  @HostListener('click') onMouseClick() {
    this.deselectAll();
  }

  @HostListener('document:keypress', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (!this.isAddingNewCaseVisibility && !this.isWarningVisibility) {
      if (event.code === 'Enter') {
        const value: string = (document.activeElement as HTMLInputElement).value;
        if(value) {
          if (this.selectedCase) {
            this.onCaseChanged(+value);
          }
          else if (this.selectedBox) {
            this.onBoxChanged(value);
          }
        }
        this.deselectAll();
      }
    }
  }

  @HostListener('window:beforeunload') beforeUnload() {
    this.saveStorage();
  }

  deselectAll(): void {
    this.selectedCase = null;
    this.selectedBox = null;
  }

  onBoxClick(curBox: IBoxStorage) {
    this.onPreventClick();

    if (this.selectedBox == curBox && !this.selectedCase) return;

    this.deselectAll();
    this.selectedBox = curBox;
  }

  onCaseClick(curBox: IBoxStorage, curCase: ICaseStorage) {
    this.onPreventClick();

    if (this.selectedCase == curCase) return;

    this.deselectAll();
    this.selectedBox = curBox;
    this.selectedCase = curCase;
  }

  onCaseChanged(value: number): void {
    if (this.selectedCase) {
      this.selectedCase.amount = value >= 0 ? value : this.selectedCase.amount;
      this.storage.markAsChanged();
    }
  }
  
  onBoxChanged(value: string): void {
    if (this.selectedBox) {
      this.selectedBox.title = value || this.selectedBox.title;
      this.storage.markAsChanged();
    }
  }

  getTitleById(id: number): Observable<string> {
    return this.partsService.getShortInfoById(id)
    .pipe(
      map(
        (result: IPartShortInfo) => 
        {
          return result.title;
        }
      )
    );
  }

  onAddStorageClick(): void {
    this.onPreventClick();

    const box: IBoxStorage = this.storage.addNewBox();

    this.deselectAll();
    this.selectedBox = box;

    this.storage.markAsChanged();
  }

  onAddCaseClick(): void {
    this.onPreventClick();

    const newCase: ICaseStorage = {
      id: -1,
      amount: 0
    };

    this.selectedCase = newCase;

    this.isAddingNewCaseVisibility = true;
  }

  getDescriptionById(id: number): Observable<string> {
    return this.partsService.getShortInfoById(id)
    .pipe(
      map(
        (result: IPartShortInfo) => 
        {
          return result.description || '---';
        }
      )
    );
  }

  trackByCaseId(index: number, item: ICaseStorage): number {
    return item.id;
  }

  ngOnDestroy() {
    if (this.storage.hasChanges()) {
      this.saveStorage();
    }
  }

  saveStorage(): void {
    this.storage.saveStorage();
  }

  onDeleteBoxClick(): void {
    this.isWarningVisibility = true;
  }

  onDeleteCaseClick(): void {
    this.onPreventClick();

    this.isWarningVisibility = true;
  }

  onDeleteCancelClick = () => {
    this.isWarningVisibility = false;
  }

  onDeleteConfirmClick = () => {
    this.isWarningVisibility = false;

    if (this.selectedCase) {
      const index = this.selectedBox.cases.indexOf(this.selectedCase);

      if (index != -1) {
        this.selectedBox.cases.splice(index, 1);

        if (this.inSearchMode) {
          this.storage.removeCaseFromBoxById(this.selectedBox.id, this.selectedCase);
        }
      }
    }
    else {
      const index = this.boxList.indexOf(this.selectedBox);

      if (index != -1) {
        this.boxList.splice(index, 1);

        if (this.inSearchMode) {
          this.storage.removeBoxById(this.selectedBox.id);
        }
      }
    }

    this.deselectAll();

    this.storage.markAsChanged();
  }

  onPreventClick(): void {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  onAddNewCaseConfirmClicked = () => {
    this.isAddingNewCaseVisibility = false;

    this.selectedBox.cases.push(this.selectedCase);

    this.storage.markAsChanged();
  }

  onAddNewCaseCancelClicked = () => {
    this.isAddingNewCaseVisibility = false;

    this.selectedCase = null;
  }

  hasChanges(): boolean {
    return this.storage.hasChanges()
  }
}
