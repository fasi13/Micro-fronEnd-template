import { Validators } from '@angular/forms';

import { FieldConfig, ValidateFileSize } from '@forge/shared';

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
  },
  'Image': {
    type: 'image',
    label: 'Value',
    name: 'imageValue',
    placeholder: 'Enter value',
    validation: {
      required: {
        errorMsg: 'Image is required',
        validator: Validators.required
      },
      fileSize: {
        errorMsg: 'File size exceed, should not be more than 3mb.',
        validator: ValidateFileSize
      }
    }
  },
  'Document': {
    type: 'document',
    label: 'Value',
    name: 'documentValue',
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
    name: 'colorValue',
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
    name: 'logoValue',
    options: [],
    placeholder: 'Select Logo Display',
    value: '',
    validation: {
      required: {
        errorMsg: 'Please select a Logo Display',
        validator: Validators.required
      },
    }
  },
  'Number':   {
    type: 'number',
    label: 'Value',
    name: 'numberValue',
    options: [],
    placeholder: 'Enter value',
    value: '',
    validation: {
      required: {
        errorMsg: 'Number Value is required',
        validator: Validators.required
      },
    }
  },
  'Checkbox':   {
    type: 'checkbox',
    label: 'Value',
    name: 'checkboxValue',
    options: [],
    placeholder: '',
    value: '',
    validation: {
    }
  },
  'HTML': {
    type: 'html',
    label: 'Value',
    name: 'htmlValue',
    placeholder: 'Enter value',
    validation: {
      required: {
        errorMsg: 'Value is required',
        validator: Validators.required
      }
    }
  },
  'Stylesheet': {
    type: 'stylesheet',
    label: 'Value',
    name: 'stylesheetValue',
    placeholder: 'Enter value',
    validation: {
      required: {
        errorMsg: 'Value is required',
        validator: Validators.required
      }
    }
  }
};
