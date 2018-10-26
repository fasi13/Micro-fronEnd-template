import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.model';

@Component({
  selector: 'fge-form-text',
  templateUrl: './form-text.component.html'
})
export class FormTextComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
}
