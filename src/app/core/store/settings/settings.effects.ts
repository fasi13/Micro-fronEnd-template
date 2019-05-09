import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

import { DataPaginated, SettingGroup, ApiResponse } from '../../models';
import { SettingsTypes, FetchSettingGroupsSuccess, FetchSettingGroupsError } from './settings.actions';
import { SettingsService } from '../../services/settings.service';

@Injectable()
export class SettingsEffects {
  @Effect() public fetch: Observable<Action> = this.actions.pipe(
    ofType(SettingsTypes.FETCH_SETTING_GROUPS),
    switchMap(() =>
        this.settingsService.getSettingGroups()
        .pipe(
          map((response: ApiResponse<DataPaginated<SettingGroup>>) => {
            return new FetchSettingGroupsSuccess(response.data);
          }),
          catchError(error => of(new FetchSettingGroupsError({ error : error })))
        )
    )
  );

  constructor(
    private actions: Actions,
    private settingsService: SettingsService
  ) {}
}
