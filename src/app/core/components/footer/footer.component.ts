import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LocalizationService} from "../../services/localization/localization.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit {

  constructor(public loc: LocalizationService) { }

  ngOnInit() {
  }

}
