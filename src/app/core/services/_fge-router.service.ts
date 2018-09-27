import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Store } from '@ngrx/store';

import { State, getApplicationInfo } from '../store/store.reducers';
import { Application } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FgeRouterService {

  constructor(
    private ngRouter: Router,
    private store: Store<State>
  ) { }

  navigate(route: string, extras?: NavigationExtras): void {
    this.store.select(getApplicationInfo)
      .subscribe(({ id: applicationId }: Application) => {
        if (applicationId) {
          this.ngRouter.navigate([`/tenant/${applicationId}/${route}`], extras);
        } else  {
          this.ngRouter.navigate([route], extras);
        }
      });
  }
}
