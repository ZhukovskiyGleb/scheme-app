import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {LocalizationService} from "../localization/localization.service";

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService{
  updateEvent = new Subject<string>();
  
  constructor(private loc: LocalizationService) {
    
  }

  showMessage(error: Partial<{code: string}>): void {
    this.updateEvent.next(
      this.getErrorMessage(error.code)
    );
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case ('auth/user-not-found'):
        return this.loc.byId('error_user_not_found');
      case ('auth/wrong-password'):
        return this.loc.byId('error_wrong_password');
      case ('auth/invalid-email'):
        return this.loc.byId('error_invalid_email');
      case ('auth/email-already-in-use'):
        return this.loc.byId('error_email_in_use');
      default:
        return this.loc.byId('error_error');
    }
  }
}
