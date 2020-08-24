import { Directive, OnInit, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import _delay from 'lodash/delay';

@Directive({
  selector: '[fgeClearInput]'
})
export class ClearInputDirective implements OnInit {

  @Input() inputClear: any;
  @Output() readonly clearClicked: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(
    private element: ElementRef
  ) {}

  ngOnInit() {
    const current = this.element.nativeElement as HTMLInputElement;
    if (current.nodeName.toUpperCase() !== 'INPUT') {
      throw new Error('Invalid input type for clearableInput:' + current);
    }
    const wrapper = document.createElement('span');
    const clearIcon = document.createElement('i');
    clearIcon.id = 'clearIcon';

    clearIcon.addEventListener('click', () => this.clearValue());

    wrapper.setAttribute('style',
      'padding: 2px;position: absolute;right: 10px;top: 3px;background-color: white;z-index: 3;color: #6C757D;');

    clearIcon.setAttribute('style', 'display:none');
    clearIcon.className = 'fge-clickable fas fa-times';
    wrapper.appendChild(clearIcon);
    wrapper.id = 'clearSpan';

    current.insertAdjacentElement('afterend', wrapper);
    current.addEventListener('focusin', () => this.showElement());
    current.addEventListener('focusout', () => this.hideElement());
    current.addEventListener('keyup', () => this.showElement());
  }

  showElement() {
    const clearIcon = document.getElementById('clearIcon');
    if (clearIcon && this.inputClear) {
      clearIcon.removeAttribute('style');
    }
  }

  hideElement() {
    const clearIcon = document.getElementById('clearIcon');
    if (clearIcon) {
      _delay(() => {
        clearIcon.setAttribute('style', 'display:none');
      }, 300);
    }
  }

  clearValue() {
    this.inputClear = '';
    if (this.clearClicked) {
      this.clearClicked.emit(this.inputClear);
    }
    _delay(() => {
      this.element.nativeElement.focus();
    }, 300);
  }
}
