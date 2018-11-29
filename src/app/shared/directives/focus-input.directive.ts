import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[fgeFocusInput]'
})
export class FocusInputDirective implements AfterViewInit {

  @Input() focus: boolean;

  constructor(
    private element: ElementRef
  ) { }

  ngAfterViewInit() {
    if (this.focus) {
      this.element.nativeElement.focus();
    }
  }
}
