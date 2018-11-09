import { Validators } from '@angular/forms';

import { FieldConfig } from '@forge/shared';

export const configUpdate: FieldConfig[] = [
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
        type: 'toggleButton',
        label: 'Account Status',
        name: 'activeUser',
        validation: {},
        value: true,
        options: ['Active', 'Desactive']
    },
    {
        label: 'Save',
        name: 'save',
        type: 'button'
    }
];
