import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, isAuthenticated } from '../store/store.reducers';
import { Go } from '../store/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedGuard implements CanActivate {

  constructor(private store: Store<State>) {}

  canActivate(): Observable<boolean> | boolean {
    const isAuthenticated$ = this.store.select(isAuthenticated);
    isAuthenticated$.subscribe(authenticated => {
      if (!authenticated) {
        this.store.dispatch(new Go({ path: ['/login'] }));
      }
    });
    return isAuthenticated$;
  }

  canActivateChild(): Observable<boolean> | boolean {
    return this.canActivate();
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated$ = this.store.select(isAuthenticated);
    isAuthenticated$.subscribe(authenticated => {
      if (!authenticated) {
        this.store.dispatch(new Go({ path: ['/login'] }));
      }
    });
    return isAuthenticated$;
  }
}
