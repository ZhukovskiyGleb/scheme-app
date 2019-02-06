import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-properties-list',
  templateUrl: './properties-list.component.html',
  styleUrls: ['./properties-list.component.css']
})
export class PropertiesListComponent implements OnInit {

  @Input() title: string;
  // @Input() listFunction: (type: number, subtype) => AbstractControl[];

  constructor() { }

  ngOnInit() {
  }

}
