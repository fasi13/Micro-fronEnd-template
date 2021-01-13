import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { State, FetchContentGroups } from '@forge/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationRolesGuard implements CanActivate {

  constructor(
    private store: Store<State>
  ) {}

  canActivate(): Observable<boolean> {
    return this.getFromStoreOrAPI()
      .pipe(
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
    this.store.dispatch(new FetchContentGroups());
    return of(true);
  }
}
