import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";

import { Observable, of, timer } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import {
  AuthorizationActionTypes,
  AuthenticationErrorAction,
  AuthenticationSuccessAction,
  LogoutAction,
  LogoutSuccessAction,
  LogoutErrorAction
} from "./authorization.actions";
import { UserService } from "../../services";
import { User } from "../../models";
import { State, isAuthenticated } from "../store.reducers";

@Injectable()
export class AuthorizationEffects {

  INACTIVITY_TIME = 15 * 60 * 1000;

  @Effect()
  public authenticate$: Observable<Action> = this.actions
    .pipe(
      ofType(AuthorizationActionTypes.AUTHENTICATE),
      switchMap((action: any) => {
        return this.userService.authenticate(action.payload)
          .pipe(
            map((response: HttpResponse<Response>) => {
              const body: Body = response.body;
              const authInfo = response.headers.get('authentication-info');
              const authToken = authInfo.split(' ')[1];
              localStorage.setItem('token', authToken);
              localStorage.setItem('user', JSON.stringify(body['data']));
              return new AuthenticationSuccessAction({ user: body['data'] as User });
            }),
            catchError(error => of(new AuthenticationErrorAction({error: error})))
          )
      })
    );

  @Effect()
  public logout$: Observable<Action> = this.actions.pipe(
    ofType(AuthorizationActionTypes.LOGOUT),
    withLatestFrom(this.store.select(isAuthenticated)),
    switchMap(([action, isAuthenticated]: [any, boolean]) => this.userService.logout(action.payload, !!isAuthenticated)
        .pipe(
          map(() => new LogoutSuccessAction()),
          catchError(error => of(new LogoutErrorAction({error: error})))
        )
    )
  );

  @Effect()
  inactivityTimeout$ = this.actions
    .pipe(
      switchMap(() => timer(this.INACTIVITY_TIME)),
      map(() => new LogoutAction('Inactivity'))
    );

  constructor(
    private actions: Actions,
    private store: Store<State>,
    private userService: UserService
  ) {
  }
}
