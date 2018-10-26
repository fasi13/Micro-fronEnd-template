import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.model';

@Component({
  selector: 'fge-form-image',
  templateUrl: './form-image.component.html'
})
export class FormImageComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
}
