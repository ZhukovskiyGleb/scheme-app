import { Component, OnInit, Input } from '@angular/core';
import {LocalizationService} from "../../../core/services/localization/localization.service";

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.css']
})
export class LoadingModalComponent implements OnInit {

  @Input() isActive: boolean = false;

  constructor(public loc: LocalizationService) { }

  ngOnInit() {
  }

}
