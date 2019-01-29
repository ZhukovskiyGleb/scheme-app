import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import { LoginValidators } from '../share/login-validators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  editForm: FormGroup;

  constructor(private auth: AuthService,
              private navigate: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, LoginValidators.checkLength])
    });
  }

  submitForm() {
    if (this.editForm.valid) {
      this.editForm.disable();
      this.auth.login(this.editForm.value.email, this.editForm.value.password)
      .subscribe( (result: boolean) => {
        if (result) {
          this.navigate.navigate(['/parts']);
        }
      }, (error) => {
        switch (error.code) {
          case ('auth/user-not-fount'):

            break;
          case ('auth/wrong-password'):

            break;
        }
        this.editForm.enable();
      });
    }
  }

}
