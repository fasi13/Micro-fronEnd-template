import _assign from 'lodash/assign';

import { ApplicationContent, ContentGroup } from '../../models';
import { ContentActionTypes, ContentActions } from './content.actions';

export interface ContentState {
  groups: {
    loading: boolean,
    items: ApplicationContent[],
  };
  group: {
    loading: boolean,
    data: ContentGroup,
  };
  content: {
    loading: boolean,
    data: ApplicationContent,
  };
  record: {
    loading: boolean,
    error?: any
  };
  edit: {
    loading: boolean,
    error?: any
  };
  error?: any;
}

const initialState: ContentState = {
  groups: {
    loading: false,
    items: null
  },
  group: {
    loading: false,
    data: null
  },
  content: {
    loading: false,
    data: null
  },
  record: {
    loading: false,
    error: null
  },
  edit: {
    loading: false,
    error: null
  }
};

export function reducer(state: ContentState = initialState, action: ContentActions): ContentState {
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

    case ContentActionTypes.FETCH_CONTENT:
      return _assign({}, state, {
        content: {
          loading: true
        }
      });

    case ContentActionTypes.FETCH_CONTENT_COMPLETED:
      return _assign({}, state, {
        content: {
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

    case ContentActionTypes.CONTENT_RECORD_TRANSACTION:
      return _assign({}, state, {
        record: {
          loading: true,
          error: null
        },
      });

    case ContentActionTypes.CONTENT_RECORD_TRANSACTION_COMPLETED:
      return _assign({}, state, {
        record: {
          loading: false,
          error: null
        },
      });

    case ContentActionTypes.CONTENT_RECORD_TRANSACTION_ERROR:
      return _assign({}, state, {
        record: {
          loading: false,
          error: action.payload
        },
      });

    case ContentActionTypes.CONTENT_EDIT_TRANSACTION:
      return _assign({}, state, {
        edit: {
          loading: true,
          error: null
        },
      });

    case ContentActionTypes.CONTENT_EDIT_TRANSACTION_COMPLETED:
      return _assign({}, state, {
        edit: {
          loading: false,
          error: null
        },
      });

    case ContentActionTypes.CONTENT_EDIT_TRANSACTION_ERROR:
      return _assign({}, state, {
        edit: {
          loading: false,
          error: action.payload
        },
      });

    default:
      return state;
  }
}

export const isLoadingGroups = (state: ContentState) => state.groups.loading;
export const isLoadingGroup = (state: ContentState) => state.group.loading;
export const isLoadingContent = (state: ContentState) => state.content.loading;
export const getGroups = (state: ContentState) => state.groups.items;
export const getGroup = (state: ContentState) => state.group.data;
export const getContent = (state: ContentState) => state.content.data;
export const getRecordState = (state: ContentState) => state.record;
export const getEditState = (state: ContentState) => state.edit;
