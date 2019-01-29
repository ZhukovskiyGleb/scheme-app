import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators, FormBuilder} from "@angular/forms";
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
              private navigation: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      email: [null, [
        Validators.required,
        Validators.email
      ]],
      password: [null, [
        Validators.required, 
        LoginValidators.checkLength
      ]]
    });
  }

  submitForm() {
    if (this.editForm.valid) {
      this.editForm.disable();
      const {email, password} = this.editForm.value;
      this.auth.login(email, password)
      .subscribe(() => {
          this.navigation.navigate(['/parts']);
      }, () => {
        this.editForm.enable();
      });
    }
  }

}
