import { Component, OnInit, Input } from '@angular/core';
import { noop } from 'rxjs';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css']
})
export class DeleteConfirmComponent implements OnInit {

  @Input() isActive: boolean = false;
  @Input() caseSelected: boolean = false;
  @Input() onConfirmCallback: () => void = noop;
  @Input() onCancelCallback: () => void = noop;

  constructor() { }

  ngOnInit() {
  }

  onConfirmClick(): void {
    this.onConfirmCallback();
  }

  onCancelClick(): void {
    this.onCancelCallback();
  }  
}
