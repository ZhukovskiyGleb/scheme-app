import { FormGroup, ValidationErrors, FormControl } from '@angular/forms';

export class LoginValidators {
    static checkEqual(group: FormGroup): ValidationErrors | null {
        if (group.value.new !== group.value.confirm) {
          return {equal: true};
        }
        return null;
      }
    
    static checkLength(control: FormControl): ValidationErrors | null {
        if (control.value && control.value.length < 6) {
          return {length: true};
        }
        return null;
      }
}