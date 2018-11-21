import { Component, ViewChild, OnInit } from '@angular/core';
import _clone from 'lodash/clone';
import { Store } from '@ngrx/store';

import { ResetPassword, State, getResetedPassword, getAuthenticatedUser } from '@forge/core';
import { DynamicFormComponent, FieldConfig } from '../dynamic-form';
import { configResetPasswordFields } from './reset-password.config';

@Component({
  selector: 'fge-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  config: FieldConfig[];
  private userId: any;
  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.config = _clone(configResetPasswordFields);
    this.store.select(getAuthenticatedUser)
    .subscribe((response) => {
      this.userId = response.id;
    });
  }

  submit({ value: formData, success, error}): void {
    const payload = {
      userId: this.userId,
      resetPassword: {
        newPassword: formData.newPassword,
        oldPassword: formData.currentPassword
      }
    };
    this.store.dispatch(new ResetPassword(payload));
    this.store.select(getResetedPassword)
      .subscribe((response) => {
        const { error: errorData, loading } = response;
        if (errorData) {
          const errors = Object.values(errorData.error.fields);
          error(errors);
        } else if (!loading) {
          success();
        }
      });
  }
}
