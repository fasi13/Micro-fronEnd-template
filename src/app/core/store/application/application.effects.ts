import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";

import { Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import {
  ActionTypes,
  FetchApplicationDataError,
  FetchApplicationDataSuccess
} from "./application.actions";
import { User } from "../../models";
import { State, getAuthenticatedUser } from "../store.reducers";
import { ApplicationService } from "../../services/application.service";
import { HttpResponse } from "@angular/common/http";
import { Application } from "../../models/application.model";

@Injectable()
export class ApplicationEffects {

  @Effect()
  public fetchApplicationData: Observable<Action> = this.actions$.pipe(
    ofType(ActionTypes.FETCH_APPLICATION_DATA),
    withLatestFrom(this.store$.select(getAuthenticatedUser)),
    switchMap(([action, user]: [any, User]) => this.applicationService.performRequest(user.actions['getApplication'])
      .pipe(
        map((response: HttpResponse<any>) => new FetchApplicationDataSuccess(response)),
        catchError(error => of(new FetchApplicationDataError({ error: error })))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private applicationService: ApplicationService
  ) {
  }
}
