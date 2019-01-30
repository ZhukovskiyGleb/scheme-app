import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from 'src/app/core/services/currentUser/current-user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public currentUser: CurrentUserService) { }

  ngOnInit() {
  }

}
