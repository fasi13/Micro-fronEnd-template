import { Component, OnInit  } from '@angular/core';

import { FormField } from '../../models/form-field.abstract';

@Component({
  selector: 'fge-field-text',
  templateUrl: './field-toggle-button.component.html'
})
export class FieldToggleButtonComponent extends FormField implements  OnInit  {
  currentControl: any;
  ngOnInit() {
    this.currentControl = this.group.controls[this.config.name];
    this.currentControl.value = 'true';
    console.log(this.currentControl);
  }
}
