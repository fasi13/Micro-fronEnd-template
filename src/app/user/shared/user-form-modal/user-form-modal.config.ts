import { Validators } from '@angular/forms';

import { FieldConfig, ValidateMatchPassword } from '@forge/shared';

const userName: FieldConfig = {
  type: 'text',
  label: 'UserName',
  name: 'userName',
  placeholder: 'Enter userName',
  validation: {
    required: {
      errorMsg: 'UserName is required',
      validator: Validators.required
    },
    minlength: {
      errorMsg: 'UserName should have at least 2 characters',
      validator: Validators.minLength(2)
    },
    maxlength: {
      errorMsg: 'UserName should not have more than 50 characters',
      validator: Validators.maxLength(50)
    },
  }
};
const password: FieldConfig = {
  type: 'password',
  label: 'Password',
  name: 'password',
  placeholder: 'Password',
  validation: {
    required: {
      errorMsg: 'Password is required',
      validator: Validators.required
    },
    minlength: {
      errorMsg: 'Password should have at least 6 characters',
      validator: Validators.minLength(6)
    },
    maxlength: {
      errorMsg: 'Password should not have more than 500 characters',
      validator: Validators.maxLength(500)
    },
  }
};
const confirmPassword = {
  type: 'password',
  label: 'Confirm Password',
  name: 'confirmPassword',
  placeholder: 'Confirm password',
  validation: {
    required: {
      errorMsg: 'Confirm password is required',
      validator: Validators.required
    },
    minlength: {
      errorMsg: 'Confirm password should have at least 6 characters',
      validator: Validators.minLength(6)
    },
    maxlength: {
      errorMsg: 'Confirm Password should not have more than 500 characters',
      validator: Validators.maxLength(500)
    },
    matchPassword: {
      errorMsg: 'The confirm password does not match with the password',
      validator: ValidateMatchPassword('password')
    }
  }
};
const toggleButton: FieldConfig = {
  type: 'toggleButton',
  label: 'Account Status',
  name: 'activeUser',
  validation: {},
  options: ['Active', 'Inactive']
};
const firstName = {
  type: 'text',
  label: 'First Name',
  name: 'firstName',
  placeholder: 'First Name',
  validation: {
    required: {
      errorMsg: 'First name is required',
      validator: Validators.required
    },
    minlength: {
      errorMsg: 'First Name should have at least 2 characters',
      validator: Validators.minLength(2)
    },
    maxlength: {
      errorMsg: 'First Name should not have more than 200 characters',
      validator: Validators.maxLength(200)
    }
  }
};
const lastName: FieldConfig = {
  type: 'text',
  label: 'Last Name',
  name: 'lastName',
  placeholder: 'Last Name',
  validation: {
    required: {
      errorMsg: 'Last name is required',
      validator: Validators.required
    },
    minlength: {
      errorMsg: 'Last Name should have at least 2 characters',
      validator: Validators.minLength(2)
    },
    maxlength: {
      errorMsg: 'Last Name should not have more than 200 characters',
      validator: Validators.maxLength(200)
    }
  }
};
const email: FieldConfig = {
  type: 'text',
  label: 'Email',
  name: 'emailAddress',
  placeholder: 'Email',
  validation: {
    required: {
      errorMsg: 'Email address is required',
      validator: Validators.required
    },
    email: {
      errorMsg: 'Please enter a valid Email address',
      validator: Validators.email
    },
    maxlength: {
      errorMsg: 'Email should not have more than 200 characters',
      validator: Validators.maxLength(200)
    }
  }
};
const searchApp: FieldConfig = {
  type: 'searchApplication',
  label: 'Applicatinon Name',
  name: 'applicationId',
  validation: {},
};
export const configNewUserFields: FieldConfig[] = [
  userName,
  password,
  confirmPassword,
  toggleButton,
  firstName,
  lastName,
  email,
  searchApp
];
export const configUpdateUserFields: FieldConfig[] = [ firstName, lastName, email, toggleButton ];
