import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import {
  tap,
  switchMap,
  catchError,
  take
} from 'rxjs/operators';

import {
  State,
  getGroups,
  FetchContentGroups,
  ContentGroup
} from '@forge/core';

@Injectable({
  providedIn: 'root'
})
export class GroupsListingGuard implements CanActivate {

  constructor(
    private store: Store<State>
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.getFromStoreOrAPI()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
  }

  private getFromStoreOrAPI(): Observable<any> {
    return this.store
      .select(getGroups)
      .pipe(
        tap((groups: ContentGroup[]) => {
          if (!groups || !groups.length) {
            this.store.dispatch(new FetchContentGroups());
          }
        }),
        take(1)
      );
  }
}
