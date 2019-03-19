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
import { HttpResponse } from '@angular/common/http';
import { ResourceService } from '../../services';
import { EmptyAction } from '../store.actions';

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

  @Effect() public ExportUser: Observable<Action> = this.actions.pipe(
    ofType(UserTypes.EXPORT_USER_DATA),
    withLatestFrom(this.store.select(getApplicationInfo)),
    switchMap(([action, applicationInfo]: [any, Application]) => this.userService.exportUserList(
      applicationInfo.id,
      action.payload.sort,
      action.payload.filters,
    ).pipe(
        map((response: HttpResponse<Blob>) => {
          const fileName = 'ExportUserReport.csv';
          /**
          * @TODO Refactor this implementation since the link to export url should be provided
          * in links array and shouldn't use custom services anymore
          */
          this.resourceService.downloadHttpResource(response, fileName);
          return new EmptyAction();
        }),
        catchError(error => of(new FetchUsersError({error: error})))
      )
    )
  );

  constructor(
    private actions: Actions,
    private userService: UserService,
    private notifierService: NotifierService,
    private store: Store<State>,
    private resourceService: ResourceService
    ) {}
}
