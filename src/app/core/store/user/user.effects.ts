/* tslint:disable:max-classes-per-file */
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';

import {
  UserTypes,
  UserTransactionSuccess,
  UserTransactionError,
  FetchUsers,
  FetchUsersError,
  FetchUsersSuccess
} from './user.actions';
import { UserService } from '../../services/user.service';
import { User, ApiResponse, DataPaginated, Application } from '../../models';
import { State, getApplicationInfo } from '../store.reducers';

enum UserMethods { POST = 'createNewUser', PUT = 'updateUser' }

@Injectable()
export class UserEffects {
  @Effect() public userTransaction: Observable<Action> = this.actions.pipe(
    ofType(UserTypes.USER_TRANSACTION),
    switchMap((action: any): any => this.userService[UserMethods[action.method]](action.payload)
      .pipe(
        mergeMap(() => {
          if (action.method === 'POST') {
            this.notifierService.notify('success', 'The user has been created successfully');
          } else {
            this.notifierService.notify('success', 'The user has been updated successfully');
          }
          return [new UserTransactionSuccess(), new FetchUsers({})];
        }),
        catchError((error) => {
          this.notifierService.notify('error', 'Error while processing your request. Please try again later.');
          return of(new UserTransactionError({error: error}));
        })
      )
    )
  );

  @Effect() public fetchUsers: Observable<Action> = this.actions.pipe(
    ofType(UserTypes.FETCH_USERS),
    withLatestFrom(this.store.select(getApplicationInfo)),
    switchMap(([action, applicationInfo]: [any, Application]) => this.userService.getUsers(
      applicationInfo.id,
      action.payload.offset,
      action.payload.limit,
      action.payload.filters,
      action.payload.sort)
      .pipe(
        map((response: ApiResponse<DataPaginated<User>>) => {
          return new FetchUsersSuccess(response.data);
        }),
        catchError(error => of(new FetchUsersError({error: error})))
      )
    )
  );
  constructor(
    private actions: Actions,
    private userService: UserService,
    private notifierService: NotifierService,
    private store: Store<State>
    ) {
  }
}
