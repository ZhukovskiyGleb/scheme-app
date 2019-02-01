import { Directive, ElementRef, HostListener } from '@angular/core';
import { element } from '@angular/core/src/render3';

@Directive({
  selector: '[appRightClick]'
})
export class RightClickDirective {

  constructor(private element: ElementRef) { 
    
  }

  @HostListener('contextmenu', ['$event']) onRightClick(event: Event) {
    event.preventDefault();
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.element.nativeElement.classList.add('is-selected');
  }

  @HostListener('mouseout') onMouseOut() {
    this.element.nativeElement.classList.remove('is-selected');
  }

}
