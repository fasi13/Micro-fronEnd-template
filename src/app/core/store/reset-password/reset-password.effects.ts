/* tslint:disable:max-classes-per-file */
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
  ResetPasswordTypes,
  ResetPasswordSuccess,
  ResetPasswordError
} from './reset-password.actions';
import { UserService } from '../../services/user.service';

@Injectable()
export class ResetPasswordEffects {
  @Effect() public resetPassword$: Observable<Action> = this.actions.pipe(
    ofType(ResetPasswordTypes.RESET_PASSWORD),
    switchMap((action: any) => {
      return this.userService.resetPassword(action.payload)
        .pipe(
          map(() => {
            this.notifierService.notify('success', 'The password has been updated successfully');
            return new ResetPasswordSuccess({ response: 'success changes.'});
          }),
          catchError((error) => {
            this.notifierService.notify('error', 'Error while processing your request. Please try again later.');
            return of(new ResetPasswordError({error: error}));
          })
        );
    })
  );

  constructor(
    private actions: Actions,
    private userService: UserService,
    private notifierService: NotifierService
    ) {}
}
