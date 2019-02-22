import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/core/services/auth/auth.service';
import {Router} from '@angular/router';
import {LoginValidators} from '../../shared/login-validators';
import {ErrorModalService} from 'src/app/core/services/error-modal/error-modal.service';
import {LocalizationService} from "../../../../core/services/localization/localization.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  public editForm: FormGroup;

  constructor(private auth: AuthService,
              private navigation: Router,
              private fb: FormBuilder,
              private errorModal: ErrorModalService,
              public loc: LocalizationService) { }

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
          this.navigation.navigate(['/home']);
      }, (error) => {
        this.errorModal.showMessage(error);
        this.editForm.enable();
      });
    }
  }


}
