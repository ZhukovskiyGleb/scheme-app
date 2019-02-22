import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CurrentUserService} from 'src/app/core/services/currentUser/current-user.service';
import {LocalizationService} from "../../../core/services/localization/localization.service";
import {LangRefresher} from "../../../shared/decorators/lang-refresh.decorator";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@LangRefresher
export class HomeComponent implements OnInit {

  constructor(public currentUser: CurrentUserService,
              public loc: LocalizationService) { }

  ngOnInit() {
    
  }

}
