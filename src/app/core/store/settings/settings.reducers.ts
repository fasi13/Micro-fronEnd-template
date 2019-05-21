import _assign from 'lodash/assign';

import { SettingsTypes, SettingsActions } from './settings.actions';

export interface SettingState {
  settingGroups: any;
  settingGroup: any;
}

export const initialState: SettingState = {
  settingGroups: {
    loading: false
  },
  settingGroup: {
    loading: false
  }
};

export function reducer(
  state: SettingState = initialState,
  action: SettingsActions
): SettingState {
  switch (action.type) {
    case SettingsTypes.FETCH_SETTING_GROUPS:
      return _assign({}, state, {
        settingGroups: _assign({}, state.settingGroups, {
          loading: true,
          error: {}
        })
      });

    case SettingsTypes.FETCH_SETTING_GROUPS_ERROR:
      return _assign({}, state, {
        settingGroups: {
          loading: false,
          error: action.payload
        }
      });

    case SettingsTypes.FETCH_SETTING_GROUPS_SUCCESS:
      return _assign({}, state, {
        settingGroups: _assign({}, state.settingGroups, {
          loading: false,
          items: action.payload.items,
          limit: action.payload.limit,
          offset: action.payload.offset,
          totalCount: action.payload.totalCount,
        })
      });

      case SettingsTypes.FETCH_SETTING_GROUP:
        return _assign({}, state, {
          settingGroup: _assign({}, state.settingGroup, {
            loading: true,
            error: {}
          })
        });

      case SettingsTypes.FETCH_SETTING_GROUP_ERROR:
        return _assign({}, state, {
          settingGroup: {
            loading: false,
            error: action.payload
          }
        });

      case SettingsTypes.FETCH_SETTING_GROUP_SUCCESS:
        return _assign({}, state, {
          settingGroup: _assign({}, state.settingGroup, {
            loading: false,
            ...action.payload
          })
        });

    default:
      return state;
  }
}

export const getSettingGroups = (state: SettingState) => state.settingGroups;
export const getSettingGroup = (state: SettingState) => state.settingGroup;
