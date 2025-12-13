import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import {LocalizationService} from "../../../core/services/localization/localization.service";
import {LangRefresher} from 'src/app/shared/decorators/lang-refresh.decorator';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@LangRefresher
export class LoadingModalComponent implements OnInit {

  @Input() isActive: boolean = false;

  constructor(public loc: LocalizationService,
              public cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
