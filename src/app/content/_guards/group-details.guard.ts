import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import {
  take,
  tap,
  filter,
  switchMap,
  catchError,
  withLatestFrom
} from 'rxjs/operators';

import {
  State,
  getGroups,
  ContentGroup,
  getGroup,
  FetchContentGroup,
  FetchContentGroups
} from '@forge/core';


@Injectable({
  providedIn: 'root'
})
export class GroupDetailsGuard implements CanActivate {

  constructor(
    private store: Store<State>
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const groupId = route.paramMap['params'].groupId;
    return this.getFromStoreOrAPI(groupId).pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  private getFromStoreOrAPI(contentGroupId: string): Observable<any> {
    return this.store
      .select(getGroups)
      .pipe(
        tap((contentGroups: ContentGroup[]) => {
          if (!contentGroups) {
            this.store.dispatch(new FetchContentGroups());
          }
        }),
        filter((contentGroups: ContentGroup[]) => !!contentGroups),
        withLatestFrom(this.store.select(getGroup)),
        tap(([_groups]: [ContentGroup[], ContentGroup]) => {
          // Need to always get the group from API to show new contents created from Mass communication activities
          this.store.dispatch(new FetchContentGroup(contentGroupId));
        }),
        take(1)
      );
  }
}
