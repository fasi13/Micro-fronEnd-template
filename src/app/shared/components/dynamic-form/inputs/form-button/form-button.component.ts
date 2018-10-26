import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.model';

@Component({
  selector: 'fge-form-button',
  templateUrl: './form-button.component.html'
})
export class FormButtonComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
}
