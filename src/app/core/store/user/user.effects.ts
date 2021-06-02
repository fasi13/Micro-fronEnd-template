/* tslint:disable:max-classes-per-file */
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';
import _assign from 'lodash/assign';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';

import {
  UserTypes,
  UserTransactionSuccess,
  UserTransactionError,
  FetchUsers,
  FetchUsersError,
  FetchUsersSuccess,
  FetchRolesSuccess,
  FetchRolesError,
  FetchRolePermissionsSuccess,
  FetchRoleUsersSuccess,
  ExecuteRoleActionSuccess,
  FetchRoles,
  ExecuteRoleActionError
} from './user.actions';
import { UserService } from '../../services/user.service';
import { User, ApiResponse, DataPaginated, Application, ApplicationLink, UserRoleLink } from '../../models';
import { State, getApplicationInfo } from '../store.reducers';
import { HttpResponse } from '@angular/common/http';
import { ResourceService, FgeHttpActionService } from '../../services';
import { EmptyAction } from '../store.actions';
import { UserRole } from '../../models/user/user-role.model';

enum UserMethods { POST = 'createNewUser', PUT = 'updateUser' }

@Injectable()
export class UserEffects {
  @Effect() public userTransaction: Observable<{}> = this.actions.pipe(
    ofType(UserTypes.USER_TRANSACTION),
    withLatestFrom(this.store.select(getApplicationInfo)),
    switchMap(([action, applicationInfo]: [any, Application]) =>
      this.userService[UserMethods[action.method]](applicationInfo.id, { ...action.payload, roleIds: [] })
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
          const fileName = response.headers.get('X-FileName');
          /**
          *  Refactor this implementation since the link to export url should be provided
          * in links array and shouldn't use custom services anymore
          */
          this.resourceService.downloadHttpResource(response, fileName);
          return new EmptyAction();
        }),
        catchError(error => of(new FetchUsersError({error: error})))
      )
    )
  );

  @Effect() public fetchRoles: Observable<Action> = this.actions.pipe(
    ofType(UserTypes.FETCH_ROLES),
    withLatestFrom(this.store.select(getApplicationInfo)),
    switchMap(([action, applicationInfo]: [any, Application]) => this.fgeActionService.performAction(
      applicationInfo,
      ApplicationLink.ROLES,
      {
        params: {
          offset: action.payload.offset,
          limit: action.payload.limit
        }
      }
    )
      .pipe(
        map((response: ApiResponse<DataPaginated<UserRole>>) => {
          return new FetchRolesSuccess(response.data);
        }),
        catchError(error => of(new FetchRolesError({error: error})))
      )
  ));

  @Effect() public fetchRolePermissions: Observable<Action> = this.actions.pipe(
    ofType(UserTypes.FETCH_ROLE_PERMISSIONS),
    switchMap(({ payload: userRole }: any) => this.fgeActionService.performAction(
      userRole,
      UserRoleLink.PERMISSIONS
    )
      .pipe(
        map((response: ApiResponse<DataPaginated<any>>) => {
          const role: UserRole = _assign({}, userRole, { permissions: response.data });
          return new FetchRolePermissionsSuccess(role);
        }),
        catchError(error => of(new FetchRolesError({ error: error })))
      )
  ));


  @Effect() public fetchRoleUsers: Observable<Action> = this.actions.pipe(
    ofType(UserTypes.FETCH_ROLE_USERS),
    switchMap(({ payload: userRole }: any) => this.fgeActionService.performAction(
      userRole,
      UserRoleLink.USERS_BY_ROLE
    )
      .pipe(
        map((response: ApiResponse<DataPaginated<any>>) => {
          const role: UserRole = _assign({}, userRole, { users: response.data });
          return new FetchRoleUsersSuccess(role);
        }),
        catchError(error => of(new FetchRolesError({ error: error })))
      )
  ));

  @Effect() public executeRoleAction: Observable<{}> = this.actions.pipe(
    ofType(UserTypes.EXECUTE_ROLE_ACTION),
    withLatestFrom(this.store.select(getApplicationInfo)),
    switchMap(([action, applicationInfo]: [any, Application]): any => this.fgeActionService.performAction(
      action.payload.role || applicationInfo,
      action.payload.action,
      {
        body: action.payload.actionPayload
      })
      .pipe(
        mergeMap(() => {
          return [new ExecuteRoleActionSuccess({ ...action.payload }), new FetchRoles()];
        }),
        catchError(({ error }) => {
          if (error && error.error.userMessage) {
            this.notifierService.notify('error', error.error.userMessage);
          } else {
            this.notifierService.notify('error', 'Error while processing your request. Please try again later.');
          }
          return of(new ExecuteRoleActionError({ error: error }));
        })
      )
    )
  );

  constructor(
    private actions: Actions,
    private userService: UserService,
    private notifierService: NotifierService,
    private store: Store<State>,
    private resourceService: ResourceService,
    private fgeActionService: FgeHttpActionService
  ) { }
}
