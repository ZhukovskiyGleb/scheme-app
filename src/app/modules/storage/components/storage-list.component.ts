import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { Observable, Subscription, of } from 'rxjs';
import { IBoxStorage, StorageModel, ICaseStorage } from 'src/app/core/models/storage-model';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import { filter, switchMap, tap, map } from 'rxjs/operators';
import { CurrentUserService } from 'src/app/core/services/currentUser/current-user.service';
import { PartsService, IPartShortInfo } from 'src/app/core/services/parts/parts.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe
export class StorageListComponent implements OnInit, OnDestroy {
  boxList: IBoxStorage[];
  selectedCase: ICaseStorage;

  isBusy: boolean = false;

  private storageSubscription: Subscription;

  constructor(private currentUser: CurrentUserService,
              private navigation: Router,
              private storage: StorageService,
              private partsService: PartsService,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.isBusy = true;

    this.loadStorage();
  }

  loadStorage():void {
    if (this.storageSubscription) {
      this.storageSubscription.unsubscribe();
    }

    this.storageSubscription = this.storage.loadStorage()
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

  @HostListener('click') onMouseClick() {
    this.selectedCase = null;
  }

  onCaseClick(event: Event, boxID: number, caseID: number, selected: ICaseStorage) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (this.selectedCase == selected) return;

    this.selectedCase = selected;
  }

  onCaseChanged(item: ICaseStorage, value: number): void {
    item.amount = value;
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
    // console.log('save me!');
    console.log('destroy', this.boxList);
  }
}
