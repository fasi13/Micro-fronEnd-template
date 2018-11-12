/* tslint:disable:max-classes-per-file */
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

import {
  NewUserErrorAction,
  NewUserSuccessAction,
  UserManagementTypes,
  UpdateUserSuccessAction,
  UpdateUserErrorAction,
  FetchUserAction,
  FetchUserErrorAction
} from './user-management.actions';
import { UserService } from '../../services/user.service';

@Injectable()
export class UserManagamentEffects {
    @Effect() public newUser: Observable<Action> = this.actions.pipe(
      ofType(UserManagementTypes.NEW_USER),
        switchMap((action: any) => this.userService.createNewUser(action.payload)
            .pipe(
              map(() => {
                this.notifierService.notify('success', 'The user has been created successfully');
                return new NewUserSuccessAction({ response: 'success changes.'});
              }),
              catchError((error) => {
                this.notifierService.notify('error', 'Error while processing your request. Please try again later.');
                return of(new NewUserErrorAction({error: error}));
              })
            )
        )
    );

    @Effect() public udapteUser: Observable<Action> = this.actions.pipe(
      ofType(UserManagementTypes.UPDATE_USER),
      switchMap((action: any) => this.userService.updetedUser(action.payload)
          .pipe(
            map(() => {
              this.notifierService.notify('success', 'The user has been updated successfully');
              return new UpdateUserSuccessAction({ response: 'success changes.'});
            }),
            catchError((error) => {
              this.notifierService.notify('error', 'Error while processing your request. Please try again later.');
              return of(new UpdateUserErrorAction({error: error}));
            }
          )
      )
    ));


    @Effect() public getUsers: Observable<Action> = this.actions.pipe(
      ofType(UserManagementTypes.FETCH_USER),
      switchMap(() => this.userService.geUsers()
          .pipe(
            map(() => {
              return new FetchUserAction({ response: 'success changes.'});
            }),
            catchError(error => of(new FetchUserErrorAction({error: error})))
          )
      )
    );
    constructor(
      private actions: Actions,
      private userService: UserService,
      private notifierService: NotifierService
      ) {
    }
}
