import { Directive, OnChanges, ElementRef } from '@angular/core';

@Directive({
  selector: '[fgeFocusInput]'
})
export class FocusInputDirective implements OnChanges {

  constructor(
    private element: ElementRef
  ) { }

  ngOnChanges() {
    this.element.nativeElement.focus();
  }
}
