import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, AfterContentInit, OnChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { noop, Observable, Subscription, from, of } from 'rxjs';
import { ICaseStorage } from 'src/app/core/models/storage-model';
import { PartsService } from 'src/app/core/services/parts/parts.service';
import { PartModel } from 'src/app/core/models/part-model';
import { tap, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-case',
  templateUrl: './new-case.component.html',
  styleUrls: ['./new-case.component.css']
})
@AutoUnsubscribe
export class NewCaseComponent implements OnInit {

  @Input() isActive: boolean = false;
  @Input() selectedCase: ICaseStorage;
  @Input() onConfirmCallback: () => void = noop;
  @Input() onCancelCallback: () => void = noop;

  @ViewChild('newTitle') title: ElementRef;
    
  private searchSubscription: Subscription;
  caseForm: FormGroup;

  searchList: PartModel[];
  // searchList$: Observable<PartModel[]>;

  constructor(private partsService: PartsService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.caseForm = new FormGroup({
      title: new FormControl('', {updateOn: 'change'}),
      amount: new FormControl(0)
    });

    this.searchSubscription = this.caseForm.get('title').valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(
        (value: string) => {
          if (value && value.length > 0) {
            return this.partsService.searchPartsByTitle(value, 5);
          } 
          else {
            return of([]);
          }
        }
      )
    )
    .subscribe(
      (parts: PartModel[]) => {
        if (parts) {
          this.searchList = parts;
          this.cd.detectChanges();
        }
      }
    );
  }

  onPartSelected(part: PartModel): void {
    console.log('olol');

    this.selectedCase.id = part.id;
    this.caseForm.get('title').setValue(part.title);
    // this.cd.detectChanges();
  }
  
  onConfirmClick(): void {
    this.clear();

    this.onConfirmCallback();
  }

  onCancelClick(): void {
    this.clear();

    this.onCancelCallback();
  }

  clear(): void {
    this.caseForm.get('title').setValue('');
    this.caseForm.get('title').setValue('');
  }

  onCaseChanged(value: number): void {
    this.selectedCase.amount = value >= 0 ? value : this.selectedCase.amount;
  }

  get isTitleSelected(): boolean {
    return this.title ? document.activeElement == this.title.nativeElement : false;
  }
}
