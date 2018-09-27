import _assign from 'lodash/assign';

import { ApplicationContent } from "../../models";
import { ContentActionTypes, ContentActions } from './content.actions';

export interface ContentState {
  groups: {
    loading: boolean,
    items: ApplicationContent[],
  },
  error?: any
}

const initialState: ContentState = {
  groups: {
    loading: false,
    items: null
  }
};

export function reducer(state: any = initialState, action: ContentActions): ContentState {
  switch (action.type) {
    case ContentActionTypes.FETCH_CONTENT_GROUPS:
      return _assign({}, state, {
        groups: {
          loading: true
        }
      });

    case ContentActionTypes.FETCH_CONTENT_GROUPS_COMPLETED:
      return _assign({}, state, {
        groups: {
          loading: false,
          items: action.payload
        }
      });

    case ContentActionTypes.FETCH_CONTENT_ERROR:
      return _assign({}, state, {
        groups: {
          loading: false,
          items: null
        },
        error: action.payload
      });

    default:
      return state;
  }
}

export const isLoadingGroups = (state: ContentState) => state.groups.loading;
export const getGroups = (state: ContentState) => state.groups.items;
