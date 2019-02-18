import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, FetchUsers } from '@forge/core';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersListingGuard implements CanActivate {
  constructor(private store: Store<State>) {}

  canActivate(): Observable<boolean> | boolean {
    return this.getFromStoreOrAPI().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  private getFromStoreOrAPI(): Observable<any> {
    /**
     * @TODO Check if users has been loaded or there is a list of them in store,
     *  but in order to get that completed we should refactor users listing component
     *  to have the pagination, sorting variables in redux/store, then we can implement that
     *  logic to perform the action to fetch users.
     */
    this.store.dispatch(new FetchUsers());
    return of(true);
  }
}
