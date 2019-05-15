import { Validators } from '@angular/forms';

import { FieldConfig } from '@forge/shared';

const groupName: FieldConfig = {
  type: 'text',
  label: 'Group Name',
  name: 'groupName',
  placeholder: 'Setting Group Name',
  validation: {
    required: {
      errorMsg: 'Name is required.',
      validator: Validators.required
    },
    minlength: {
      errorMsg: 'Name must be at least 3 characters',
      validator: Validators.minLength(2)
    }
  }
};

export const configGroupFields: FieldConfig[] = [groupName];
