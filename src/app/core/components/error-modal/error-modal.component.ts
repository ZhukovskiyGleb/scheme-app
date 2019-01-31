import { Component, OnInit, Input } from '@angular/core';
import { ErrorModalService } from '../../services/error-modal/error-modal.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {

  message: string = "";
  isVisible: boolean = false;

  constructor(private errorModal: ErrorModalService) { }

  ngOnInit() {
    this.errorModal.updateEvent.subscribe(
      message => {
        this.message = message;
        this.isVisible = true;
      }
    );
  }

}
