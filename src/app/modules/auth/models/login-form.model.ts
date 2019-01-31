import { Validators } from '@angular/forms';
import { LoginValidators } from '../shared/login-validators';

export class LoginFormModel {
    email = [null, [Validators.required, Validators.email]];
    password = [null, [
      Validators.required,
      LoginValidators.checkLength
    ]];
  }