import { Validators } from '@angular/forms';

import { FieldConfig, ValidateMatchPassword } from '../dynamic-form';

const currentPassword: FieldConfig = {
  type: 'password',
  label: 'Current password',
  name: 'currentPassword',
  placeholder: 'Current Password',
  validation: {
    required: {
      errorMsg: 'Password is required.',
      validator: Validators.required
    }
  }
};
const newPassword: FieldConfig = {
  type: 'password',
  label: 'New Password',
  name: 'newPassword',
  placeholder: 'New password',
  validation: {
    required: {
      errorMsg: 'New password is required.',
      validator: Validators.required
    },
    minlength: {
      errorMsg: 'Password should have at least 6 characters.',
      validator: Validators.minLength(6)
    },
    maxlength: {
      errorMsg: 'Password should not have more than 500 characters.',
      validator: Validators.maxLength(500)
    },
  }
};
const confirmNewPassword = {
  type: 'password',
  label: 'Confirm New Password',
  name: 'confirmNewPassword',
  placeholder: 'Confirm new password',
  validation: {
    required: {
      errorMsg: 'Confirm password is required.',
      validator: Validators.required
    },
    minlength: {
      errorMsg: 'Confirm password should have at least 6 characters.',
      validator: Validators.minLength(6)
    },
    maxlength: {
      errorMsg: 'Confirm password should not have more than 500 characters.',
      validator: Validators.maxLength(500)
    },
    matchPassword: {
      errorMsg: 'The passwords you entered do not match. Please check your typing and try again.',
      validator: ValidateMatchPassword('newPassword')
    }
  }
};

export const configResetPasswordFields: FieldConfig[] = [
  currentPassword,
  newPassword,
  confirmNewPassword,
];
