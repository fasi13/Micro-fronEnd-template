import _assign from 'lodash/assign';

import { Application } from "../../models/application.model";
import { ApplicationActions, ApplicationActionTypes } from "./application.actions";
import { mapLinks } from '../util';
import { ApiResponse, DataPaginated, ApplicationContent, ApplicationBranding } from "../../models";

export interface ApplicationState {
  info: Application;
  branding: ApplicationBranding;
  error?: string;
  loading: boolean;
  loaded: boolean;
}

const initialState: ApplicationState = {
  info: null,
  branding: null,
  loading: false,
  loaded: false
};

export function reducer(state: any = initialState, action: ApplicationActions): ApplicationState {
  switch (action.type) {
    case ApplicationActionTypes.FETCH_APPLICATION_DATA:
      return _assign({}, state, {
        error: undefined,
        loading: true
      });

    case ApplicationActionTypes.FETCH_APPLICATION_DATA_ERROR:
      return _assign({}, state, {
        error: action.payload.error.message,
        loaded: true
      });

    case ApplicationActionTypes.FETCH_APPLICATION_DATA_SUCCESS: {
      const applicationInfo: Application = action.payload.info.data;
      const {
        primaryColor,
        secondaryColor,
        primaryLogo,
        siteUrl,
        programName,
        secondaryLogo
      }: { [key: string]: ApiResponse<DataPaginated<ApplicationContent>> } = action.payload.branding;
      return _assign({}, state, {
        info: { ...applicationInfo, actions: mapLinks(applicationInfo._links) },
        branding: {
          primaryColor: primaryColor.data.items[0],
          secondaryColor: secondaryColor.data.items[0],
          primaryLogo: primaryLogo.data.items[0],
          siteUrl: siteUrl.data.items[0],
          programName: programName.data.items[0],
          secondaryLogo: secondaryLogo.data.items[0]
        },
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

/**
 * Returns the current application branding.
 * @function getApplicationBranding
 * @param {State} state
 * @returns {Application}
 */
export const getApplicationBranding = (state: ApplicationState) => state.branding;