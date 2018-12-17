import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { State, getAuthenticatedUser } from '@forge/core-store';
import { take, filter, map } from 'rxjs/operators';
import { User } from '../models';
import { Observable } from 'rxjs';

export enum PreferenceType {
  GROUP_LISTING_VIEW = 'group_listing_view',
}

@Injectable({
  providedIn: 'root'
})
export class UserPrefenceService {

  constructor(
    private store: Store<State>
  ) { }

  upsertPreference(type: PreferenceType, value: string): void {
    this.store.select(getAuthenticatedUser)
      .pipe(
        filter(user => !!user),
        take(1),
      )
      .subscribe((user: User) => localStorage.setItem(`${type}::${user.id}`, value));
  }

  getPreference(type: PreferenceType): Observable<string> {
    return this.store.select(getAuthenticatedUser)
      .pipe(
        filter(user => !!user),
        take(1),
        map((user: User) => {
          return localStorage.getItem(`${type}::${user.id}`);
        }),
      );
  }
}
