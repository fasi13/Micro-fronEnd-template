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
                errorMsg: 'First Name should have at least 2 characters',
                validator: Validators.minLength(2)
            },
            maxlength: {
                errorMsg: 'First Name should not have more than 200 characters',
                validator: Validators.maxLength(200)
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
                errorMsg: 'Last Name should have at least 2 characters',
                validator: Validators.minLength(2)
            },
            maxlength: {
                errorMsg: 'Last Name should not have more than 200 characters',
                validator: Validators.maxLength(200)
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
            },
            maxlength: {
                errorMsg: 'Email should not have more than 200 characters',
                validator: Validators.maxLength(200)
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
    }
];
