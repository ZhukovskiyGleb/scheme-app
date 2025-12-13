import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {noop} from 'rxjs';
import {LocalizationService} from "../../../../core/services/localization/localization.service";
import {LangRefresher} from 'src/app/shared/decorators/lang-refresh.decorator';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@LangRefresher
export class DeleteConfirmComponent implements OnInit {

  @Input() isActive: boolean = false;
  @Input() caseSelected: boolean = false;
  @Input() onConfirmCallback: () => void = noop;
  @Input() onCancelCallback: () => void = noop;

  constructor(public loc: LocalizationService,
              public cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  onConfirmClick(): void {
    this.onConfirmCallback();
  }

  onCancelClick(): void {
    this.onCancelCallback();
  }  
}
