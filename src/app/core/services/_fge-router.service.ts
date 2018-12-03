import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Store } from '@ngrx/store';

import { State, getApplicationInfo } from '../store/store.reducers';
import { Application } from '../models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FgeRouterService implements OnDestroy {

  private selectUnsubscription = new Subject();

  constructor(
    private ngRouter: Router,
    private store: Store<State>
  ) { }

  ngOnDestroy() {
    this.selectUnsubscription.complete();
  }

  navigate(route: string, extras?: NavigationExtras): void {
    this.store.select(getApplicationInfo)
      .pipe(takeUntil(this.selectUnsubscription))
      .subscribe(({ id: applicationId }: Application) => {
        if (applicationId) {
          this.ngRouter.navigate([`/tenant/${applicationId}/${route}`], extras);
        } else  {
          this.ngRouter.navigate([route], extras);
        }
        this.selectUnsubscription.next();
      });
  }
}
