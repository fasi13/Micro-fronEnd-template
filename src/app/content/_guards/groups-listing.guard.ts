import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { tap, switchMap, catchError, take, withLatestFrom, filter } from 'rxjs/operators';

import { State, getGroups, FetchContentGroups, getApplicationInfo, Application } from '@forge/core';

@Injectable({
  providedIn: 'root'
})
export class GroupsListingGuard implements CanActivate {

  constructor(
    private store: Store<State>
  ) {}

  private getFromStoreOrAPI(): Observable<any> {
    return this.store
      .select(getApplicationInfo)
      .pipe(
        filter((applicationInfo: Application) => !!applicationInfo),
        withLatestFrom(this.store.select(getGroups)),
        tap(([_applicationInfo, groups]: [Application, any]) => {
          if (!groups || !groups.length) {
            this.store.dispatch(new FetchContentGroups());
          }
        }),
        take(1)
      );
  }

  canActivate(): Observable<boolean> | boolean {
    return this.getFromStoreOrAPI()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }
}
