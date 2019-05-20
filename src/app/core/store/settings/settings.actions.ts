/* tslint:disable:max-classes-per-file */
import { Action } from '@ngrx/store';
import { ActionType } from '../util';
import { ListingParams, FgeStoreAction } from '../../models';

export const SettingsTypes = {
  FETCH_SETTING_GROUPS: ActionType('FETCH_SETTING_GROUPS'),
  FETCH_SETTING_GROUPS_SUCCESS: ActionType('FETCH_SETTING_GROUPS_SUCCESS'),
  FETCH_SETTING_GROUPS_ERROR: ActionType('FETCH_SETTING_GROUPS_ERROR'),
};

export class FetchSettingGroups extends FgeStoreAction {
  constructor(public model?: ListingParams) {
    super(SettingsTypes.FETCH_SETTING_GROUPS, model,  { limit: 12, offset: 0 });
  }
}

export class FetchSettingGroupsSuccess extends FgeStoreAction {
  constructor(public data?: any) {
    super(SettingsTypes.FETCH_SETTING_GROUPS_SUCCESS, data);
  }
}

export class FetchSettingGroupsError implements Action {
  public type: string = SettingsTypes.FETCH_SETTING_GROUPS_ERROR;
  constructor(public payload?: any) {}
}

export type SettingsActions =
  FetchSettingGroups |
  FetchSettingGroupsSuccess |
  FetchSettingGroupsError;
