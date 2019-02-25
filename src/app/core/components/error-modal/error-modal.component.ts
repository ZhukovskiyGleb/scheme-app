import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {ErrorModalService} from '../../services/error-modal/error-modal.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorModalComponent implements OnInit {

  message: string = "";
  isVisible: boolean = false;

  constructor(private errorModal: ErrorModalService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.errorModal.updateEvent.subscribe(
      (message: string) => {
        this.message = message;
        this.isVisible = true;
        this.cd.markForCheck();
      }
    );
  }

}
