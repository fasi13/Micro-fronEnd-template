import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  State,
  isLoadingApplicationData,
  isAuthenticated
} from '@forge/core-store';
import {
  withLatestFrom,
  filter,
  switchMap,
  catchError
} from 'rxjs/operators';

@Component({
  selector: 'fge-application-loader',
  templateUrl: './application-loader.component.html',
})
export class ApplicationLoaderComponent implements OnInit {

  loadingApplicationData$: Observable<boolean>;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.loadingApplicationData$ = this.store.select(isLoadingApplicationData)
      .pipe(
        withLatestFrom(this.store.select(isAuthenticated)),
        filter(([_loading, isAuth]: boolean[]) => isAuth),
        switchMap(([loading]: [boolean]) => of(loading)),
        catchError(() => of(false))
      );
  }

}
