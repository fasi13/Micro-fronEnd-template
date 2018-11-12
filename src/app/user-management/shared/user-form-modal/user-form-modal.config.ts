import { Validators } from '@angular/forms';

import { FieldConfig } from '@forge/shared';

export const config: FieldConfig[] = [
    {
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
            errorMsg: 'Name should have at least 2 characters',
            validator: Validators.minLength(2)
            },
            maxlength: {
            errorMsg: 'Name should not have more than 15 characters',
            validator: Validators.maxLength(15)
            }
        }
    },
    {
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
            errorMsg: 'Description should have at least 6 characters',
            validator: Validators.minLength(6)
            }
        }
    },
    {
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
            errorMsg: 'Description should have at least 6 characters',
            validator: Validators.minLength(6)
            }
        }
    },
    {
        type: 'toggleButton',
        label: 'Account Status',
        name: 'activeUser',
        validation: {},
        value: true,
        options: ['Active', 'Desactive']
    },
    {
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
            errorMsg: 'Name should have at least 2 characters',
            validator: Validators.minLength(2)
            },
            maxlength: {
            errorMsg: 'Name should not have more than 15 characters',
            validator: Validators.maxLength(15)
            }
        }
    },
    {
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
            errorMsg: 'Name should have at least 2 characters',
            validator: Validators.minLength(2)
            },
            maxlength: {
            errorMsg: 'Name should not have more than 15 characters',
            validator: Validators.maxLength(15)
            }
        }
    },
    {
        type: 'email',
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
            }
        }
    },
    {
        label: 'Save',
        name: 'save',
        type: 'button'
    }
];
