import _assign from 'lodash/assign';

import { Application } from '../../models/application/application.model';
import { ApplicationAction, ApplicationActionTypes } from './application.actions';
import { mapLinks } from '../util';
import {
  ApiResponse,
  DataPaginated,
  ApplicationContent,
  ApplicationBranding,
  ApplicationPath,
  DataType
} from '../../models';

export interface ApplicationState {
  current: {
    info: Application;
    branding: ApplicationBranding;
    error?: string;
    loading: boolean;
  };
  search: {
    data: ApplicationPath[],
    loading: boolean,
    error?: string;
  };
  types: {
    data: DataType[],
    loading: boolean,
    error?: string;
  };
  path: {
    data: ApplicationPath,
    loading: boolean,
    error?: string;
  };
  preview: {
    branding: ApplicationBranding,
    loading: boolean,
    error?: string;
  };
}

const initialState: ApplicationState = {
  current: {
    info: null,
    branding: null,
    loading: false,
  },
  search: {
    data: null,
    loading: false
  },
  types: {
    data: null,
    loading: false
  },
  path: {
    data: null,
    loading: false
  },
  preview: {
    branding: null,
    loading: false
  }
};

export function reducer(state: any = initialState, action: ApplicationAction): ApplicationState {
  switch (action.type) {
    case ApplicationActionTypes.UPDATE_APPLICATION_DATA:
      return _assign({}, state, {
        current: _assign({}, state.current, {
          error: undefined,
          loading: false
        })
      });

    case ApplicationActionTypes.FETCH_APPLICATION_DATA:
      return _assign({}, state, {
        current: _assign({}, state.current, {
          error: undefined,
          loading: true
        })
      });

    case ApplicationActionTypes.FETCH_APPLICATION_DATA_ERROR:
      return _assign({}, state, {
        current: _assign({}, state.current, {
          error: action.payload.error.message,
          loading: false
        })
      });

    case ApplicationActionTypes.FETCH_APPLICATION_DATA_SUCCESS: {
      const applicationInfo: Application = action.payload.info.data;
      const fetchBranding: { [key: string]: ApiResponse<DataPaginated<ApplicationContent>> } = action.payload.branding;
      return _assign({}, state, {
        current: _assign({}, state.current, {
          info: { ...applicationInfo, actions: mapLinks(applicationInfo._links) },
          branding: {
            primaryColor: fetchBranding.primaryColor.data.items[0],
            secondaryColor: fetchBranding.secondaryColor.data.items[0],
            primaryLogo: fetchBranding.primaryLogo.data.items[0],
            siteUrl: fetchBranding.siteUrl.data.items[0],
            programName: fetchBranding.programName.data.items[0],
            secondaryLogo: fetchBranding.secondaryLogo.data.items[0]
          },
          loading: false,
        })
      });
    }

    case ApplicationActionTypes.FETCH_APPLICATION_PATH:
      return _assign({}, state, {
        path: {
          data: undefined,
          loading: true
        }
      });

    case ApplicationActionTypes.FETCH_APPLICATION_PATH_SUCCESS:
      return _assign({}, state, {
        path: {
          data: action.payload.data,
          loading: false
        }
      });

    case ApplicationActionTypes.FETCH_APPLICATION_PATH_ERROR:
      return _assign({}, state, {
        path: {
          error: action.payload.error.message,
          loading: false
        }
      });

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

      case ApplicationActionTypes.FETCH_DATA_TYPES:
      return _assign({}, state, {
        types: {
          data: undefined,
          loading: true
        }
      });

    case ApplicationActionTypes.FETCH_DATA_TYPES_SUCCESS:
      return _assign({}, state, {
        types: {
          data: action.payload.data.items,
          loading: false
        }
      });

    case ApplicationActionTypes.FETCH_DATA_TYPES_ERROR:
      return _assign({}, state, {
        types: {
          error: action.payload.error.message,
          loading: false
        }
      });

      case ApplicationActionTypes.FETCH_APPLICATION_PREVIEW:
      return _assign({}, state, {
        preview: {
          branding: undefined,
          loading: true
        }
      });

    case ApplicationActionTypes.FETCH_APPLICATION_PREVIEW_SUCCESS:
      const branding: { [key: string]: ApiResponse<DataPaginated<ApplicationContent>> } = action.payload.branding;
      return _assign({}, state, {
        preview: {
          branding: {
            primaryColor: branding.primaryColor.data.items[0],
            secondaryColor: branding.secondaryColor.data.items[0],
            primaryLogo: branding.primaryLogo.data.items[0],
            siteUrl: branding.siteUrl.data.items[0],
            programName: branding.programName.data.items[0],
            secondaryLogo: branding.secondaryLogo.data.items[0]
          },
          loading: false,
        }
      });

    case ApplicationActionTypes.FETCH_APPLICATION_PREVIEW_ERROR:
      return _assign({}, state, {
        preview: {
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
export const getApplicationInfo = (state: ApplicationState) => state.current.info;

/**
 * Returns the current application branding.
 * @function getApplicationBranding
 * @param {State} state
 * @returns {Application}
 */
export const getApplicationBranding = (state: ApplicationState) => state.current.branding;

/**
 * Returns the current state of application loading flag.
 * @function isLoadingApplicationData
 * @param {State} state
 * @returns {boolean}
 */
export const isLoadingApplicationData = (state: ApplicationState) => state.current.loading;

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

/**
 * Returns true if the data types are loading, otherwise false.
 * @function isLoadingDataTypes
 * @param {State} state
 * @returns {boolean}
 */
export const isLoadingDataTypes = (state: ApplicationState) => state.types.loading;

/**
 * Returns the list of data types for given application id.
 * @function getDataTypes
 * @param {State} state
 * @returns {DataType[]}
 */
export const getDataTypes = (state: ApplicationState) => state.types.data;

/**
 * Returns the current application path.
 * @function getApplicationPath
 * @param {State} state
 * @returns {Application}
 */
export const getApplicationPath = (state: ApplicationState) => state.path;

/**
 * Returns the application preview for a given application.
 * @function getApplicationPath
 * @param {State} state
 * @returns {Application}
 */
export const getApplicationPreview = (state: ApplicationState) => state.preview;
