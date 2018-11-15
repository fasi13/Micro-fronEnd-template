import { Validators } from '@angular/forms';

import { FieldConfig } from '@forge/shared';

export const config: FieldConfig[] = [
  {
    type: 'html',
    name: 'value',
    placeholder: 'Enter value',
    validation: {
      required: {
        errorMsg: 'Value is required',
        validator: Validators.required
      }
    }
  }
];
