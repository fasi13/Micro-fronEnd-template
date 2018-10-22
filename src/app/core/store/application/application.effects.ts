import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import _find from 'lodash/find';

import { Observable, of, forkJoin } from "rxjs";
import { catchError, map, switchMap, withLatestFrom, exhaustMap } from 'rxjs/operators';

import {
  ApplicationActionTypes,
  FetchApplicationDataError,
  FetchApplicationDataSuccess,
  SearchApplicationSuccess,
  SearchApplicationError,
  ApplicationAction
} from "./application.actions";
import { User, ApiResponse, DataPaginated, Link, HateoasAction, ApplicationContent, ApplicationPath } from "../../models";
import { State, getAuthenticatedUser } from "../store.reducers";
import { ApplicationService } from "../../services/application.service";
import { Application } from "../../models/application.model";

@Injectable()
export class ApplicationEffects {

  @Effect()
  public fetchApplicationData$: Observable<Action> = this.actions.pipe(
    ofType(ApplicationActionTypes.FETCH_APPLICATION_DATA),
    withLatestFrom(this.store.select(getAuthenticatedUser)),
    switchMap(([action, user]: [ApplicationAction, User]) => this.applicationService.getApplicationInfo(action.payload)
      .pipe(
        exhaustMap((applicationResponse: ApiResponse<Application>) => {
          const { href, method }: Link = _find(applicationResponse.data._links, ['rel', 'contents']);
          const contentsHateoas: HateoasAction = { href, method: method.method };
          return forkJoin(
            of(applicationResponse),
            this.applicationService.getContentFor(contentsHateoas, 'Primary Color'),
            this.applicationService.getContentFor(contentsHateoas, 'Secondary Color'),
            this.applicationService.getContentFor(contentsHateoas, 'Primary Logo'),
            this.applicationService.getContentFor(contentsHateoas, 'Site URL'),
            this.applicationService.getContentFor(contentsHateoas, 'Program Name'),
            this.applicationService.getContentFor(contentsHateoas, 'Secondary Logo')
          )
        }),
        map(([
            info,
            primaryColor,
            secondaryColor,
            primaryLogo,
            siteUrl,
            programName,
            secondaryLogo
          ]: ApiResponse<DataPaginated<ApplicationContent>>[]) => {
            const application = {
              info,
              branding: {
                primaryColor,
                secondaryColor,
                primaryLogo,
                siteUrl,
                programName,
                secondaryLogo
              }
            }
            return new FetchApplicationDataSuccess(application);
          }),
        catchError(error => of(new FetchApplicationDataError({ error })))
      )
    )
  );

  @Effect()
  public searchApplication$: Observable<Action> = this.actions
    .pipe(
      ofType(ApplicationActionTypes.SEARCH_APPLICATION),
      switchMap((action: ApplicationAction) => this.applicationService.search(action.payload)
        .pipe(
          map((response: ApiResponse<DataPaginated<ApplicationPath>>) => {
            return new SearchApplicationSuccess(response);
          }),
          catchError(error => of(new SearchApplicationError({ error })))
        )
      )
    );

  constructor(
    private actions: Actions,
    private store: Store<State>,
    private applicationService: ApplicationService
  ) {
  }
}
