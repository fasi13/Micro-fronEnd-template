import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import _find from 'lodash/find';

import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap, exhaustMap, take } from 'rxjs/operators';

import {
  ApplicationActionTypes,
  FetchApplicationDataError,
  FetchApplicationDataSuccess,
  SearchApplicationSuccess,
  SearchApplicationError,
  ApplicationAction,
  FetchDataTypesSuccess,
  FetchDataTypesError,
  FetchApplicationPathSuccess,
  FetchApplicationPathError,
  FetchApplicationPreviewSuccess,
  FetchApplicationPreviewError,
} from './application.actions';
import {
  ApiResponse,
  DataPaginated,
  Link,
  HateoasAction,
  ApplicationContent,
  ApplicationPath,
  DataType,
  Application,
  User,
} from '../../models';
import { ApplicationService } from '../../services/application.service';
import { State, getAuthenticatedUser } from '../store.reducers';
import { FgeHttpActionService } from '../../services';

@Injectable()
export class ApplicationEffects {

  /*
   * @TODO: This is just a quick fix to update the website branding, but keep in mind that this is not the best way since
   *  it performs an aditional request per each update transaction, so this needs to be refactored to store the content and
   *  replace that one when its updated, instead of having an specific field for website branding. It means store all the contents
   *  in redux using a map[key: value] and then replace when someone is updated, instead of having a multiple copies across the app.
   */
  @Effect() public updateApplicationData$: Observable<Action> = this.actions.pipe(
    ofType(ApplicationActionTypes.UPDATE_APPLICATION_DATA),
    switchMap(() =>
      this.store.select(getAuthenticatedUser)
        .pipe(
          take(1),
          switchMap((user: User) => this.fgeActionService.performAction(user, 'getApplication')),
          exhaustMap(this.getApplicationBranding.bind(this)),
          map(this.mapApplicationBrandingAs(FetchApplicationDataSuccess)),
          catchError(error => {
            return of(new FetchApplicationDataError({ error }));
          })
        )
    )
  );

  @Effect() public fetchApplicationData$: Observable<Action> = this.actions.pipe(
    ofType(ApplicationActionTypes.FETCH_APPLICATION_DATA),
    switchMap(() =>
      this.store.select(getAuthenticatedUser)
        .pipe(
          take(1),
          switchMap((user: User) => this.fgeActionService.performAction(user, 'getApplication')),
          exhaustMap(this.getApplicationBranding.bind(this)),
          map(this.mapApplicationBrandingAs(FetchApplicationDataSuccess)),
          catchError(error => {
            this.handleErrorRedirect(error.status);
            return of(new FetchApplicationDataError({ error }));
          })
        )
    )
  );

  @Effect() public fethApplicationPreview$: Observable<Action> = this.actions.pipe(
    ofType(ApplicationActionTypes.FETCH_APPLICATION_PREVIEW),
    switchMap((action: ApplicationAction) => this.applicationService.getApplicationInfo(action.payload)
      .pipe(
        exhaustMap(this.getApplicationBranding.bind(this)),
        map(this.mapApplicationBrandingAs(FetchApplicationPreviewSuccess)),
        catchError(error => of(new FetchApplicationPreviewError({ error })))
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

  @Effect() public fetchApplicationPath$: Observable<Action> = this.actions
    .pipe(
      ofType(ApplicationActionTypes.FETCH_APPLICATION_PATH),
      switchMap((action: ApplicationAction) => this.applicationService.getApplicationPath(action.payload)
        .pipe(
          map((response: ApiResponse<ApplicationPath>) => {
            return new FetchApplicationPathSuccess(response);
          }),
          catchError(error => of(new FetchApplicationPathError({ error })))
        )
      )
    );

  constructor(
    private actions: Actions,
    private applicationService: ApplicationService,
    private router: Router,
    private store: Store<State>,
    private fgeActionService: FgeHttpActionService
  ) { }

  private getApplicationBranding(applicationResponse: ApiResponse<Application>):
    Observable<ApiResponse<DataPaginated<ApplicationContent>>[]> {
    const { href, method }: Link = _find(applicationResponse.data._links, ['rel', 'contents']);
    const contentsHateoas: HateoasAction = { href, method: method.method };
    return forkJoin(
      of(applicationResponse),
      this.applicationService.getContentFor(contentsHateoas, 'Primary Color'),
      this.applicationService.getContentFor(contentsHateoas, 'Secondary Color'),
      this.applicationService.getContentFor(contentsHateoas, 'Primary Logo'),
      this.applicationService.getContentFor(contentsHateoas, 'Site URL'),
      this.applicationService.getContentFor(contentsHateoas, 'Program Name'),
      this.applicationService.getContentFor(contentsHateoas, 'Secondary Logo'),
    );
  }

  private mapApplicationBrandingAs<T>(constructorFn: new (args) => T) {
    return ([
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
      };
      return new constructorFn(application);
    };
  }

  private handleErrorRedirect(errorCode) {
    if (errorCode === 404) {
      this.router.navigate(['error/application']);
    }
  }
}
