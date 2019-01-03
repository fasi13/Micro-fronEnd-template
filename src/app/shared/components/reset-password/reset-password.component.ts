import { Component, OnInit, OnDestroy } from '@angular/core';
import _clone from 'lodash/clone';
import { Store } from '@ngrx/store';
import {Location} from '@angular/common';

import { Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

import { ResetPassword, State, getResetedPassword, getAuthenticatedUser } from '@forge/core';
import { FieldConfig } from '../dynamic-form';
import { configResetPasswordFields } from './reset-password.config';

@Component({
  selector: 'fge-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  config: FieldConfig[];

  private userId: any;
  private unsubscribeReset = new Subject();
  private isAliveComponent = true;

  constructor(
    private store: Store<State>,
    private location: Location
  ) { }

  ngOnInit() {
    this.config = _clone(configResetPasswordFields);
    this.config[0].focus = true;
    this.store.select(getAuthenticatedUser)
    .pipe(takeWhile(() => this.isAliveComponent))
    .subscribe((response) => {
      this.userId = response.id;
    });
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.unsubscribeReset.complete();
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
      .pipe(takeUntil(this.unsubscribeReset))
      .subscribe((response) => {
        const { error: errorData, loading } = response;
        if (errorData) {
          const errors = Object.values(errorData.error.fields);
          this.unsubscribeReset.next();
          error(errors);
        } else if (!loading) {
          this.unsubscribeReset.next();
          success();
        }
      });
  }

  cancel(): void {
    this.location.back();
  }
}
