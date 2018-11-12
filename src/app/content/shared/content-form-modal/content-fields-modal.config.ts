import { Validators } from '@angular/forms';

import { FieldConfig } from '@forge/shared';

export const config: FieldConfig[] = [
  {
    type: 'text',
    label: 'Name',
    name: 'name',
    placeholder: 'Enter name',
    validation: {
      required: {
        errorMsg: 'Name is required',
        validator: Validators.required
      },
      minlength: {
        errorMsg: 'Name should have at least 2 characters',
        validator: Validators.minLength(2)
      },
      maxlength: {
        errorMsg: 'Name should not have more than 100 characters',
        validator: Validators.maxLength(100)
      }
    }
  },
  {
    type: 'text',
    label: 'Description',
    name: 'description',
    placeholder: 'Enter description',
    validation: {
      required: {
        errorMsg: 'Description is required',
        validator: Validators.required
      },
      minlength: {
        errorMsg: 'Description should have at least 2 characters',
        validator: Validators.minLength(2)
      },
      maxlength: {
        errorMsg: 'Description should not have more than 1000 characters',
        validator: Validators.maxLength(1000)
      }
    }
  },
  {
    type: 'select',
    label: 'Data Type',
    name: 'type',
    options: [],
    placeholder: 'Select Data Type',
    validation: {
      required: {
        errorMsg: 'Please select a Data Type',
        validator: Validators.required
      },
    }
  },
  {
    label: 'Save',
    name: 'save',
    type: 'button'
  }
];
