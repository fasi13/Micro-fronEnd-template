import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.model';

@Component({
  selector: 'fge-form-document',
  templateUrl: './form-document.component.html'
})
export class FormDocumentComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
}
