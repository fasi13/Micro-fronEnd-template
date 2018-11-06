import { Validators } from '@angular/forms';

import { FieldConfig } from '@forge/shared';

export interface ContentDataType {
  [key: string]: FieldConfig;
}

export const dataTypes: ContentDataType = {
  'Text': {
    type: 'text',
    label: 'Value',
    name: 'dynamicValue',
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
  },
  'Image': {
    type: 'image',
    label: 'Value',
    name: 'dynamicValue',
    placeholder: 'Enter value',
    validation: {
      required: {
        errorMsg: 'Image is required',
        validator: Validators.required
      }
    }
  },
  'Document': {
    type: 'document',
    label: 'Value',
    name: 'dynamicValue',
    placeholder: 'Enter value',
    validation: {
      required: {
        errorMsg: 'Document is required',
        validator: Validators.required
      }
    }
  },
  'Color Picker': {
    type: 'color',
    label: 'Value',
    name: 'dynamicValue',
    placeholder: 'Enter value',
    value: '',
    validation: {
      required: {
        errorMsg: 'Color Value is required',
        validator: Validators.required
      },
      pattern: {
        errorMsg: 'Invalid Color Value',
        validator: Validators.pattern(`^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$`)
      },
    }
  },
  'Logo Display':   {
    type: 'select',
    label: 'Logo Display',
    name: 'dynamicValue',
    options: [],
    placeholder: 'Select Logo Display',
    validation: {
      required: {
        errorMsg: 'Please select a Logo Display',
        validator: Validators.required
      },
    }
  }
};
