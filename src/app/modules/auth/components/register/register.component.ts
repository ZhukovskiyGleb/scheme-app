import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/core/services/auth/auth.service';
import {Router} from '@angular/router';
import {LoginValidators} from '../../shared/login-validators';
import {ErrorModalService} from 'src/app/core/services/error-modal/error-modal.service';
import {LocalizationService} from "../../../../core/services/localization/localization.service";
import {LangRefresher} from 'src/app/shared/decorators/lang-refresh.decorator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@LangRefresher
export class RegisterComponent implements OnInit {
  public editForm: FormGroup;

  constructor(private auth: AuthService,
              private navigation: Router,
              private fb: FormBuilder,
              private errorModal: ErrorModalService,
              public loc: LocalizationService,
              public cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      name: [null, [
        Validators.required,
        Validators.maxLength(10)
        ]
      ],
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
        this.navigation.navigate(['/home']);
      }, (error) => {
        this.errorModal.showMessage(error);
        this.editForm.enable();
      });
    }
  }

}
