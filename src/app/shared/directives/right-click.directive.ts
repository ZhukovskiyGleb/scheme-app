import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appRightClick]'
})
export class RightClickDirective {

  constructor(private element: ElementRef) { 
    
  }

  @HostListener('contextmenu', ['$event']) onRightClick(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  @HostListener('mouseenter') onMouseEnter() {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.element.nativeElement.classList.add('is-selected');
  }

  @HostListener('mouseout') onMouseOut() {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.element.nativeElement.classList.remove('is-selected');
  }

}
