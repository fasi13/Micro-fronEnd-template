import { Validators } from '@angular/forms';

import { FieldConfig } from '@forge/shared';

export interface ContentDataType {
  [key: string]: FieldConfig;
}

export const dataTypes: ContentDataType = {
  'Text': {
    type: 'text',
    label: 'Value',
    name: 'textValue',
    placeholder: 'Enter value',
    validation: {
      required: {
        errorMsg: 'Value is required',
        validator: Validators.required
      },
      minlength: {
        errorMsg: 'Value should have at least 2 characters',
        validator: Validators.minLength(2)
      }
    }
  }
};
