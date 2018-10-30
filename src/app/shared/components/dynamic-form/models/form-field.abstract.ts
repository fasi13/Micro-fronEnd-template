import { FormGroup } from '@angular/forms';

import { Field } from './field.interface';
import { FieldConfig } from './field-config.model';

export abstract class FormField implements Field {
  config: FieldConfig;
  group: FormGroup;
  getObjectKeys = Object.keys;

  hasError(): boolean {
    const currentControl = this.group.controls[this.config.name];
    const wasTouched = currentControl.touched;
    const hasErrors = currentControl.errors;
    return !!(wasTouched && hasErrors);
  }

  hasErrorFor(errorName: string): boolean {
    const errors = this.group.controls[this.config.name].errors;
    const errorFlag = !!(errors && errors[errorName]);
    return errorFlag;
  }

}
