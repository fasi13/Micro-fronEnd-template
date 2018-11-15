import _assign from 'lodash/assign';

import { User, ContentGroup } from '../../models';
import { UserTypes, UserActions } from './user.actions';

export interface UserState {
  users: {
    loading: boolean,
    items: User[],
  };
  user: {
    loading: boolean,
    data: ContentGroup,
  };
  error?: any;
}

const initialState: UserState = {
  users: {
    loading: false,
    items: null
  },
  user: {
    loading: false,
    data: null
  }
};

export function reducer(state: UserState = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserTypes.NEW_USER:
      return _assign({}, state, {
        user: {
          loading: true
        }
      });

    case UserTypes.NEW_USER_ERROR:
      return _assign({}, state, {
        user: {
          loading: false,
          data: null
        },
        error: action.payload.error
      });

    case UserTypes.NEW_USER_SUCCESS:
      return _assign({}, state, {
        user: {
          loading: false,
          data: action.payload
        }
      });

    case UserTypes.UPDATE_USER:
      return _assign({}, state, {
        user: {
          loading: true
        }
      });

    case UserTypes.UPDATE_USER_ERROR:
      return _assign({}, state, {
        user: {
          loading: false
        },
        error: action.payload.error
      });

    case UserTypes.UPDATE_USER_SUCCESS:
      return _assign({}, state, {
        user: {
          loading: false,
          data: action.payload
        }
      });

    case UserTypes.FETCH_USERS:
    return _assign({}, state, {
      users: {
        loading: true
      }
    });

    case UserTypes.FETCH_USERS_ERROR:
      return _assign({}, state, {
        users: {
          loading: false
        },
        error: action.payload.error
      });

    case UserTypes.FETCH_USERS_SUCCESS:
      return _assign({}, state, {
        users: {
          loading: false,
          items: action.payload.items
        }
      });
    default:
      return state;
  }
}

export const isLoadingUsers = (state: UserState) => state.users.loading;
export const isLoadingUser = (state: UserState) => state.user.loading;
export const getUsers = (state: UserState) => state.users.items;
