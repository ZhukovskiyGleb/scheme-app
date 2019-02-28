import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {noop, of, Subscription} from 'rxjs';
import {ICaseStorage, IPartStorage} from 'src/app/core/models/storage-model';
import {PartsService} from 'src/app/core/services/parts/parts.service';
import {PartModel} from 'src/app/core/models/part-model';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {AutoUnsubscribe} from 'src/app/shared/decorators/auto-unsubscribe.decorator';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LocalizationService} from "../../../../core/services/localization/localization.service";

interface IPartInfo {
  title: string, part: IPartStorage
}

@Component({
  selector: 'app-new-case',
  templateUrl: './new-case.component.html',
  styleUrls: ['./new-case.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe
export class NewCaseComponent implements OnInit, OnChanges {

  @Input() isActive: boolean = false;
  @Input() isNew: boolean = false;
  @Input() selectedCase: ICaseStorage;
  @Input() onConfirmCallback: () => void = noop;
  @Input() onCancelCallback: () => void = noop;

  @ViewChild('searchField') searchField: ElementRef;
    
  private searchSubscription: Subscription;

  caseForm: FormGroup;
  searchList: PartModel[];

  parts: IPartInfo[];

  titleWasFocused: boolean = false;

  constructor(private partsService: PartsService,
              private changeDetector: ChangeDetectorRef,
              public loc: LocalizationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.selectedCase) return;

    this.parts = [];

    this.selectedCase.parts.forEach(
      (part: IPartStorage) => {
        this.parts.push({
          title: this.partsService.getCachedInfoById(part.id).title,
          part: part
        });
      }
    );

    this.caseForm.get('title').setValue(this.selectedCase.title);
    this.caseForm.get('search').setValue('');
  }

  ngOnInit() {

    this.caseForm = new FormGroup({
      title: new FormControl('', Validators.required),
      search: new FormControl('', {updateOn: 'change'}),
    });

    this.searchSubscription = this.caseForm.get('search').valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(
        (value: string) => {
          if (value && value.length > 0) {
            return this.partsService.searchPartsByTitle(value, 20);
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
          this.changeDetector.detectChanges();
        }
      }
    );
  }

  onPartSelected(model: PartModel): void {

    const part: IPartStorage = {
      id: model.id,
      amount: 0
    }

    this.selectedCase.parts.push(part);

    this.parts.push({
      title: model.title,
      part: part
    });

    this.caseForm.get('search').setValue('');

    this.searchList = [];

    this.titleWasFocused = false;
  }

  onAmountChanged(info: IPartInfo, amount: number): void {
    if (info) {
      info.part.amount = amount;
    }
  }

  onDeletePartClick(model: IPartInfo): void {
    const mainIndex:number = this.selectedCase.parts.indexOf(model.part);
    if (mainIndex != -1) {
      this.selectedCase.parts.splice(mainIndex, 1);
    }

    const modelIndex:number = this.parts.indexOf(model);
    if (modelIndex != -1) {
      this.parts.splice(modelIndex, 1);
    }

    this.changeDetector.detectChanges();
  }

  @HostListener('document:keypress', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (this.isActive && event.code === 'Enter' && this.selectedCase.parts.length > 0) {
      this.onConfirmClick();
    }
  }

  onConfirmClick(): void {
    this.selectedCase.title = this.caseForm.get('title').value;

    this.onConfirmCallback();
  }

  onCancelClick(): void {
    this.onCancelCallback();
  }

  onModalClick(): void {

  }

  get isSearchSelected(): boolean {
    const isFocused: boolean = this.searchField ? document.activeElement == this.searchField.nativeElement : false;

    if (isFocused) {
      this.titleWasFocused = true;
    }

    return this.titleWasFocused || isFocused;
  }
}
