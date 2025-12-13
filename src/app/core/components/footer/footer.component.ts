import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LocalizationService} from "../../services/localization/localization.service";
import {LangRefresher} from 'src/app/shared/decorators/lang-refresh.decorator';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@LangRefresher
export class FooterComponent implements OnInit {

  constructor(public loc: LocalizationService,
              public cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
