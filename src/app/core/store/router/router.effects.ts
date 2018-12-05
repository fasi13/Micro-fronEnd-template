import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import * as RouterActions from './router.actions';

@Injectable()
export class RouterEffects {
  @Effect({ dispatch: false }) navigate$: Observable<any> = this.actions
    .ofType(RouterActions.GO)
    .pipe(
      map((action: RouterActions.Go) => action.payload),
      tap(({ path, query: queryParams, extras }) => {
          return this.router.navigate(path, { queryParams, ...extras })
        }
      )
    );

  @Effect({ dispatch: false }) navigateBack$: Observable<any> = this.actions
    .ofType(RouterActions.BACK)
    .pipe(
      tap(() => this.location.back())
    );

  @Effect({ dispatch: false }) navigateForward$: Observable<any> = this.actions
    .ofType(RouterActions.FORWARD)
    .pipe(
      tap(() => this.location.forward())
    );

  constructor(
    private actions: Actions,
    private router: Router,
    private location: Location
  ) {}
}