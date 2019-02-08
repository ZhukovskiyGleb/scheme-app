import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.css']
})
export class LoadingModalComponent implements OnInit {

  @Input() isActive: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
