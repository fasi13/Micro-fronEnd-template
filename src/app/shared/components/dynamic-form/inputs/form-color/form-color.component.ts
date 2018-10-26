import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.model';

@Component({
  selector: 'fge-form-color',
  templateUrl: './form-color.component.html'
})
export class FormColorComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
}
