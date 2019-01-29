import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginValidators } from '../share/login-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  editForm: FormGroup;

  constructor(private auth: AuthService,
              private navigate: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormGroup({
        'new': new FormControl(null, [Validators.required, LoginValidators.checkLength]),
        'confirm': new FormControl(null, Validators.required)
      }, LoginValidators.checkEqual)
    });
  }

  

  submitForm() {
    if (this.editForm.valid) {
      this.editForm.disable();
      this.auth.registerNewUser(this.editForm.value.email, this.editForm.value.password.new, this.editForm.value.name)
      .subscribe( (result: boolean) => {
        if (result) {
          this.navigate.navigate(['/parts']);
        }
      }, (error) => {
        switch (error.code) {
          case ('auth/invalid-email'):

            break;
          case ('auth/email-already-in-use'):

            break;
        }
        this.editForm.enable();
      });
    }
  }

}
