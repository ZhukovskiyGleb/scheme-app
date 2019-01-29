import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from 'src/app/core/services/auth/auth.service';
import {Router} from '@angular/router';
import {LoginValidators} from '../shared/login-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  editForm: FormGroup;

  constructor(private auth: AuthService,
              private navigation: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, [
        Validators.required, 
        Validators.email
      ]],
      password: this.fb.group({
        new: [null, [
          Validators.required, 
          LoginValidators.checkLength
        ]],
        confirm: [null, Validators.required]
      }, {validators: [LoginValidators.checkEqual]})
    });
  }

  

  submitForm() {
    if (this.editForm.valid) {
      this.editForm.disable();
      const {email, password, name} = this.editForm.value;
      this.auth.registerNewUser(email, password.new, name)
      .subscribe( () => {
        this.navigation.navigate(['/parts']);
      }, () => {
        this.editForm.enable();
      });
    }
  }

}
