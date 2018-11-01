import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
// import { State, isAuthenticated } from '../store.reducers';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import {
    // NewUserAction,
    NewUserErrorAction,
    NewUserSuccessAction,
    UserManagementTypes
} from './user-management.actions';
import { UserService } from '../../services';

@Injectable()
export class UserManagamentEffects {
    @Effect()
    public newUser$: Observable<Action> = this.actions
      .pipe(
        ofType(UserManagementTypes.NEW_USER),
        switchMap((action: any) => {
          return this.userService.createNewUser(action.payload)
            .pipe(
              map((response: any) => {
                console.log('changes success using this thing.', response);
                return new NewUserSuccessAction({ response: 'success changes.'});
              }),
              catchError(error => of(new NewUserErrorAction({error: error})))
            );
        })
      );
    constructor(
        private actions: Actions,
        // private store: Store<State>,
        private userService: UserService
        ) {
    }
}
