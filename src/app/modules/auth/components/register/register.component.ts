import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  editForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormGroup({
        'new': new FormControl(null, Validators.required),
        'confirm': new FormControl(null, Validators.required)
      }, this.checkEqual)
    });
  }

  checkEqual(group: FormGroup): ValidationErrors | null {
    if (group.value.new !== group.value.confirm) {
      return {equal: true};
    }
    return null;
  }

  submitForm() {
    if (this.editForm.valid) {
      console.log(this.editForm.value.email);
    }
  }

}
