import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { takeWhile, take, tap } from 'rxjs/operators';

import { State, isAuthenticated } from '../store/store.reducers';
import { Go } from '../store/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedGuard implements CanActivate, OnDestroy {

  private isAliveGuard = true;

  constructor(
    private store: Store<State>,
  ) {}

  ngOnDestroy() {
    this.isAliveGuard = false;
  }

  canActivate(): Observable<boolean> | boolean {
    return this.getAuthStateFromStore();
  }

  canActivateChild(): Observable<boolean> | boolean {
    return this.canActivate();
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.getAuthStateFromStore();
  }

  private getAuthStateFromStore(): Observable<any> {
    return this.store
      .select(isAuthenticated)
      .pipe(
        take(1),
        tap(isAuth => {
          if (!isAuth) {
            this.store.dispatch(new Go({ path: ['/login'] }));
          }
        })
      );
  }
}
