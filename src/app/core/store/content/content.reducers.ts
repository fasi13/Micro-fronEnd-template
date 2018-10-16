import _assign from 'lodash/assign';

import { ApplicationContent, ContentGroup } from "../../models";
import { ContentActionTypes, ContentActions } from './content.actions';

export interface ContentState {
  groups: {
    loading: boolean,
    items: ApplicationContent[],
  },
  group: {
    loading: boolean,
    data: ContentGroup,
  },
  error?: any
}

const initialState: ContentState = {
  groups: {
    loading: false,
    items: null
  },
  group: {
    loading: false,
    data: null
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

    case ContentActionTypes.FETCH_CONTENT_GROUP:
      return _assign({}, state, {
        group: {
          loading: true
        }
      });

    case ContentActionTypes.FETCH_CONTENT_GROUP_COMPLETED:
      return _assign({}, state, {
        group: {
          loading: false,
          data: action.payload
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
export const isLoadingGroup = (state: ContentState) => state.group.loading;
export const getGroups = (state: ContentState) => state.groups.items;
export const getGroup = (state: ContentState) => state.group.data;
