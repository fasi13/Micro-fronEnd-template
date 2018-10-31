import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import _find from 'lodash/find';

import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap, exhaustMap } from 'rxjs/operators';

import {
  ApplicationActionTypes,
  FetchApplicationDataError,
  FetchApplicationDataSuccess,
  SearchApplicationSuccess,
  SearchApplicationError,
  ApplicationAction,
  FetchDataTypesSuccess,
  FetchDataTypesError
} from './application.actions';
import { ApiResponse, DataPaginated, Link, HateoasAction, ApplicationContent, ApplicationPath, DataType } from '../../models';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/application.model';

@Injectable()
export class ApplicationEffects {

  @Effect() public fetchApplicationData$: Observable<Action> = this.actions.pipe(
    ofType(ApplicationActionTypes.FETCH_APPLICATION_DATA),
    switchMap((action: ApplicationAction) => this.applicationService.getApplicationInfo(action.payload)
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

  @Effect() public searchApplication$: Observable<Action> = this.actions
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

  @Effect() public fetchDataTypes$: Observable<Action> = this.actions
    .pipe(
      ofType(ApplicationActionTypes.FETCH_DATA_TYPES),
      switchMap((action: ApplicationAction) => this.applicationService.getDataTypes(action.payload)
        .pipe(
          map((response: ApiResponse<DataPaginated<DataType>>) => {
            return new FetchDataTypesSuccess(response);
          }),
          catchError(error => of(new FetchDataTypesError({ error })))
        )
      )
    );

  constructor(
    private actions: Actions,
    private applicationService: ApplicationService
  ) {
  }
}
