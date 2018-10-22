import _assign from 'lodash/assign';

import { Application } from "../../models/application.model";
import { ApplicationAction, ApplicationActionTypes } from "./application.actions";
import { mapLinks } from '../util';
import { ApiResponse, DataPaginated, ApplicationContent, ApplicationBranding, ApplicationPath } from "../../models";

export interface ApplicationState {
  info: Application;
  branding: ApplicationBranding;
  error?: string;
  loading: boolean;
  search: {
    data: ApplicationPath[],
    loading: boolean,
    error?: string;
  }
}

const initialState: ApplicationState = {
  info: null,
  branding: null,
  loading: false,
  search: {
    data: null,
    loading: false
  }
};

export function reducer(state: any = initialState, action: ApplicationAction): ApplicationState {
  switch (action.type) {
    case ApplicationActionTypes.FETCH_APPLICATION_DATA:
      return _assign({}, state, {
        error: undefined,
        loading: true
      });

    case ApplicationActionTypes.FETCH_APPLICATION_DATA_ERROR:
      return _assign({}, state, {
        error: action.payload.error.message,
        loading: false
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
        loading: false,
      });
    }

    case ApplicationActionTypes.SEARCH_APPLICATION:
      return _assign({}, state, {
        search: {
          data: undefined,
          loading: true
        } 
      });

    case ApplicationActionTypes.SEARCH_APPLICATION_SUCCESS:
      return _assign({}, state, {
        search: {
          data: action.payload.data.items,
          loading: false
        }
      });

    case ApplicationActionTypes.SEARCH_APPLICATION_ERROR:
      return _assign({}, state, {
        search: {
          error: action.payload.error.message,
          loading: false
        }
      });

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

/**
 * Returns the current state of application loading flag.
 * @function isLoadingApplicationData
 * @param {State} state
 * @returns {boolean}
 */
export const isLoadingApplicationData = (state: ApplicationState) => state.loading;

/**
 * Returns the current state of search application loading flag.
 * @function isLoadingSearchApplication
 * @param {State} state
 * @returns {boolean}
 */
export const isLoadingSearchApplication = (state: ApplicationState) => state.search.loading;

/**
 * Returns the list of application that matches with given keyword.
 * @function getSearchApplicationList
 * @param {State} state
 * @returns {ApplicationPath[]}
 */
export const getSearchApplicationList = (state: ApplicationState) => state.search.data;