import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {noop} from 'rxjs';
import {LocalizationService} from "../../../../core/services/localization/localization.service";

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmComponent implements OnInit {

  @Input() isActive: boolean = false;
  @Input() caseSelected: boolean = false;
  @Input() onConfirmCallback: () => void = noop;
  @Input() onCancelCallback: () => void = noop;

  constructor(public loc: LocalizationService) { }

  ngOnInit() {
  }

  onConfirmClick(): void {
    this.onConfirmCallback();
  }

  onCancelClick(): void {
    this.onCancelCallback();
  }  
}
