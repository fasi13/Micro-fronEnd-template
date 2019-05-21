import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import { Observable, of, forkJoin } from 'rxjs';
import { catchError, switchMap, map, withLatestFrom } from 'rxjs/operators';

import { DataPaginated, SettingGroup, ApiResponse, FgeStoreAction, Setting, Application } from '../../models';
import {
  SettingsTypes,
  FetchSettingGroupsSuccess,
  FetchSettingGroupsError,
  FetchSettingGroupSuccess,
  FetchSettingGroupError
} from './settings.actions';
import { SettingsService } from '../../services/settings.service';
import { State, getApplicationInfo } from '../store.reducers';

@Injectable()
export class SettingsEffects {
  @Effect() public fetchSettingGroups: Observable<Action> = this.actions.pipe(
    ofType(SettingsTypes.FETCH_SETTING_GROUPS),
    switchMap((action: FgeStoreAction) =>
        this.settingsService.getSettingGroups(
          action.payload.offset,
          action.payload.limit,
          action.payload.filters,
          action.payload.sort
        )
        .pipe(
          map((response: ApiResponse<DataPaginated<SettingGroup>>) => {
            return new FetchSettingGroupsSuccess(response.data);
          }),
          catchError(error => of(new FetchSettingGroupsError({ error : error })))
        )
    )
  );

  @Effect() public fetchSettingGroup: Observable<Action> = this.actions.pipe(
    ofType(SettingsTypes.FETCH_SETTING_GROUP),
    withLatestFrom(this.store.pipe(select(getApplicationInfo))),
    switchMap(([action, application]: [FgeStoreAction, Application]) =>
        forkJoin([
          this.settingsService.getSettingGroup(application.id, action.payload.id),
          this.settingsService.getGroupSettings(
            application.id,
            action.payload.id,
            action.payload.offset,
            action.payload.limit,
            action.payload.filters,
            action.payload.sort
          )
        ]).pipe(
          map(([settingGroup, settings]: [ApiResponse<SettingGroup>, ApiResponse<DataPaginated<Setting>>]) => {
            const responseData = {
              ...settingGroup.data,
              settings: settings.data
            };
            return new FetchSettingGroupSuccess(responseData);
          }),
          catchError(error => of(new FetchSettingGroupError({ error : error })))
        )
    )
  );

  constructor(
    private actions: Actions,
    private settingsService: SettingsService,
    private store: Store<State>
  ) {}
}
