
import { Application } from "../../models/application.model";
import { ApplicationActions, ActionTypes } from "./application.actions";
import { mapLinks } from '../util';

export interface ApplicationState {
  info: Application;
  error?: string;
  loading: boolean;
  loaded: boolean;
}

const initialState: ApplicationState = {
  info: null,
  loading: false,
  loaded: false
};

export function reducer(state: any = initialState, action: ApplicationActions): ApplicationState {
  switch (action.type) {
    case ActionTypes.FETCH_APPLICATION_DATA:
      return Object.assign({}, state, {
        error: undefined,
        loading: true
      });

    case ActionTypes.FETCH_APPLICATION_DATA_ERROR:
      return Object.assign({}, state, {
        error: action.payload.error.message,
        loaded: true
      });

    case ActionTypes.FETCH_APPLICATION_DATA_SUCCESS: {
      const applicationInfo: Application = action.payload.data;
      return Object.assign({}, state, {
        info:  { ...applicationInfo, actions: mapLinks(applicationInfo._links) },
        loaded: true,
      });
    }

    default:
      return state;
  }
}

/**
 * Returns the current application info.
 * @function getApplicationInfo
 * @param {State} state
 * @returns {Application}
 */
export const getApplicationInfo = (state: ApplicationState) => state.info;