import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import _isEmpty from 'lodash/isEmpty';

import { Observable, of } from 'rxjs';
import {
  tap,
  take,
  switchMap,
  catchError,
  filter
} from 'rxjs/operators';

import {
  State,
  getApplicationInfo,
  FetchApplicationData
} from '@forge/core-store';
import { Application } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TenantGuard implements CanActivate {

  constructor(
    private store: Store<State>,
  ) {}

  private getFromStoreOrAPI(route: ActivatedRouteSnapshot): Observable<any> {
    return this.store
      .select(getApplicationInfo)
      .pipe(
        tap((applicationInfo: Application) => {
          const tenantId = route.paramMap['params'].tenantId;
          if (_isEmpty(applicationInfo) || applicationInfo.id !== +tenantId) {
            if (tenantId === 'default') {
              this.store.dispatch(new FetchApplicationData());
            } else {
              this.store.dispatch(new FetchApplicationData(tenantId));
            }
          }
        }),
        filter((applicationInfo: Application) => !!applicationInfo),
        take(1)
      );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    return this.getFromStoreOrAPI(route)
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }
}
