/* tslint:disable:max-classes-per-file */
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

import {
  NewUserErrorAction,
  NewUserSuccessAction,
  UserTypes,
  UpdateUserErrorAction,
  UpdateUserSuccessAction,
  FetchUsersAction,
  FetchUsersSuccessAction,
  FetchUsersErrorAction
} from './user.actions';
import { UserService } from '../../services/user.service';
import { User, ApiResponse, DataPaginated } from '../../models';

@Injectable()
export class UserEffects {
  @Effect() public addNewUser: Observable<Action> = this.actions.pipe(
    ofType(UserTypes.NEW_USER),
      switchMap((action: any) => this.userService.createNewUser(action.payload)
        .pipe(
          mergeMap(() => {
            this.notifierService.notify('success', 'The user has been created successfully');
            return [new NewUserSuccessAction(), new FetchUsersAction()];
          }),
          catchError((error) => {
            this.notifierService.notify('error', 'Error while processing your request. Please try again later.');
            return of(new NewUserErrorAction({error: error}));
          })
        )
      )
  );

  @Effect() public updateUser: Observable<Action> = this.actions.pipe(
    ofType(UserTypes.UPDATE_USER),
    switchMap((action: any) => this.userService.updateUser(action.payload)
      .pipe(
        mergeMap(() => {
          this.notifierService.notify('success', 'The user has been updated successfully');
          return [new UpdateUserSuccessAction(), new FetchUsersAction()];
        }),
        catchError((error) => {
          this.notifierService.notify('error', 'Error while processing your request. Please try again later.');
          return of(new UpdateUserErrorAction({error: error}));
        }
      )
    )
  ));

  @Effect() public fetchUsers: Observable<Action> = this.actions.pipe(
    ofType(UserTypes.FETCH_USERS),
    switchMap(() => this.userService.getUsers()
      .pipe(
        map((response: ApiResponse<DataPaginated<User>>) => {
          return new FetchUsersSuccessAction(response.data);
        }),
        catchError(error => of(new FetchUsersErrorAction({error: error})))
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
