import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorModalService{
  updateEvent = new Subject<string>();
  
  constructor() {
    
  }

  showMessage(message: string): void {
    this.updateEvent.next(message);
  }
}
