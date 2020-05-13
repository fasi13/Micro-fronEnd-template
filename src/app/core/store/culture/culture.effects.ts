
import { Store, Action } from '@ngrx/store';
import { getCurrentCulture, getAvailableCultures, State } from './../store.reducers';
import { CultureService } from './../../services/culture.service';
import {
  CultureActionTypes,
  ReadCultureSuccessAction,
  CultureAction,
  ReadAvailableCulturesSuccessAction,
} from './culture.actions';
import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { withLatestFrom, switchMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class CultureEffects {

  @Effect() public switchCulture$: Observable<Action> = this.actions$
  .pipe(
    ofType(CultureActionTypes.SWITCH_CULTURE),
    withLatestFrom(this.store.select(getCurrentCulture)),
    switchMap(([_action, _cultureCode]: [CultureAction, string]) =>
     of(this.cultureService.setCurrentCulture(_action.payload.cultureCode))
      .pipe(
        map((newCulture) => {
          return new ReadCultureSuccessAction({ cultureCode: newCulture });
        }),
      )
    )
  );

  @Effect() public readCulture$: Observable<
    Action
  > = this.actions$.pipe(
    ofType(CultureActionTypes.READ_CULTURE),
    withLatestFrom(this.store.select(getCurrentCulture)),
    switchMap(() =>
      of(this.cultureService.getCurrentCulture()).pipe(
        map((cultureCode: string) => {
          return new ReadCultureSuccessAction({ cultureCode: cultureCode });
        })
      )
    )
  );

  @Effect() public readAvailableCultures$: Observable<
  Action
> = this.actions$.pipe(
  ofType(CultureActionTypes.READ_AVAILABLE_CULTURES),
  withLatestFrom(this.store.select(getAvailableCultures)),
  switchMap(() =>
    of(this.cultureService.getAvailableCultures()).pipe(
      map((cultures: string[]) => {
        return new ReadAvailableCulturesSuccessAction({ availableCultures: cultures });
      })
    )
  )
);

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private cultureService: CultureService
  ) {}
}
