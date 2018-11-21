import { Component, ViewChild, OnInit } from '@angular/core';
import _clone from 'lodash/clone';
import { Store } from '@ngrx/store';

import { UserResetPassword, ResetPassword, State, getResetedPassword, } from '@forge/core';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { configResetPasswordFields } from './reset-password.config';

@Component({
  selector: 'fge-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  config: FieldConfig[];

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.config = _clone(configResetPasswordFields);
  }

  submit({ value: formData, success, error}): void {
    const payload: UserResetPassword = {
      newPassword: formData.newPassword,
      oldPassword: formData.currentPassword
    };
    this.store.dispatch(new ResetPassword(payload));
    this.store.select(getResetedPassword)
      .subscribe((response) => {
        const { error: errorData, reseting } = response;
        if (errorData) {
          const errors = Object.values(errorData.error.fields);
          error(errors);
        } else if (!reseting) {
          success();
        }
      });
  }
}
