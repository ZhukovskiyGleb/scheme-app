import { FormGroup, ValidationErrors} from '@angular/forms';

export class PartsValidators {
    static dropdownRequired(group: FormGroup): ValidationErrors | null {
        if (!group.value || group.value == -1 || group.value == null) {
          return {dropdown: true};
        }
        return null;
      }
}
