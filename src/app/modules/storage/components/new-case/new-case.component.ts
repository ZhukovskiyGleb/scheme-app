import {ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {noop, of, Subscription} from 'rxjs';
import {ICaseStorage} from 'src/app/core/models/storage-model';
import {PartsService} from 'src/app/core/services/parts/parts.service';
import {PartModel} from 'src/app/core/models/part-model';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {AutoUnsubscribe} from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import {FormControl, FormGroup} from '@angular/forms';

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

  titleWasFocused: boolean = false;

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
            return this.partsService.searchPartsByTitle(value, 10);
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
    this.selectedCase.id = part.id;
    this.caseForm.get('title').setValue(part.title);

    this.searchList = [];

    this.titleWasFocused = false;
  }

  @HostListener('document:keypress', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (this.isActive && event.code === 'Enter' && this.selectedCase.id >= 0) {
      this.onConfirmClick();
    }
  }

  onConfirmClick(): void {
    this.selectedCase.amount = +this.caseForm.get('amount').value;

    this.clear();

    this.onConfirmCallback();
  }

  onCancelClick(): void {
    this.clear();

    this.onCancelCallback();
  }

  onModalClick(): void {

  }

  clear(): void {
    this.caseForm.get('title').setValue('');
    this.caseForm.get('amount').setValue(0);
  }

  get isTitleSelected(): boolean {
    const isFocused: boolean = this.title ? document.activeElement == this.title.nativeElement : false;

    if (isFocused) {
      this.titleWasFocused = true;
    }

    return this.titleWasFocused || isFocused;
  }
}
