import { Validators, FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { LoginValidators } from '../shared/login-validators';

@Injectable()
export class RegisterFormModel {

    constructor (private fb: FormBuilder) {}

    name = [null, Validators.required];


    email = [null, [
      Validators.required,
      Validators.email
    ]];
    
    password = this.fb.group({
      new: [null, [
        Validators.required,
        LoginValidators.checkLength
      ]],
      confirm: [null, Validators.required]
    }, {validators: [LoginValidators.checkEqual]});
  }