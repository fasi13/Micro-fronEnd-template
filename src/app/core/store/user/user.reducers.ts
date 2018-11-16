import _assign from 'lodash/assign';

import { User } from '../../models';
import { UserTypes, UserActions } from './user.actions';

export interface UserState {
  users: {
    loading: boolean,
    items: User[],
    error?: any;
  };
  user: {
    loading: boolean,
    data: User,
    error?: any;
  };
  error?: any;
}

const initialState: UserState = {
  users: {
    loading: false,
    items: null,
    error: null
  },
  user: {
    loading: false,
    data: null,
    error: null
  }
};

export function reducer(state: UserState = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserTypes.USER_TRANSACTION:
      return _assign({}, state, {
        user: {
          loading: true
        }
      });

    case UserTypes.USER_TRANSACTION_ERROR:
      return _assign({}, state, {
        user: {
          loading: false,
          data: null,
          error: action.payload.error
        },
      });

    case UserTypes.USER_TRANSACTION_SUCCESS:
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
          loading: false,
          error: action.payload.error
        }
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
export const getUserState = (state: UserState) => state.user;
