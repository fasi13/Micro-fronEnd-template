import _assign from 'lodash/assign';

import { User } from '../../models';
import { UserTypes, UserActions } from './user.actions';
import { UserRole } from '../../models/user/user-role.model';

export interface UserState {
  users: {
    loading: boolean,
    items: User[],
    limit?: number,
    offset?: number,
    totalCount?: number,
    error?: any;
  };
  user: {
    loading: boolean,
    data: User,
    error?: any;
  };
  roles: {
    loading: boolean,
    items: UserRole[],
    limit?: number,
    offset?: number,
    totalCount?: number,
    selected?: any
    error?: any;
    action?: {
      name?: string,
      loading: boolean,
      error?: any
    }
  };
  error?: any;
}

export const initialState: UserState = {
  users: {
    loading: false,
    items: null,
    error: null
  },
  user: {
    loading: false,
    data: null,
    error: null
  },
  roles: {
    loading: false,
    items: null,
    error: null,
    selected: {
      loading: true
    }
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
        users: _assign({}, state.users, {
          loading: true
        })
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
          items: action.payload.items,
          limit: action.payload.limit,
          offset: action.payload.offset,
          totalCount: action.payload.totalCount
        }
      });

    case UserTypes.FETCH_ROLES:
      return _assign({}, state, {
        roles: _assign({}, state.roles, {
          loading: true
        })
      });

    case UserTypes.FETCH_ROLES_ERROR:
      return _assign({}, state, {
        roles: {
          loading: false,
          error: action.payload.error
        }
      });

    case UserTypes.FETCH_ROLES_SUCCESS:
      return _assign({}, state, {
        roles: {
          loading: false,
          items: action.payload.items,
          limit: action.payload.limit,
          offset: action.payload.offset,
          totalCount: action.payload.totalCount,
          action: state.roles.action
        }
      });

    case UserTypes.FETCH_ROLE_PERMISSIONS:
    case UserTypes.FETCH_ROLE_USERS:
      return _assign({}, state,
        { roles: _assign({}, state.roles, { selected: { id: action.payload.id, loading: true }})});

    case UserTypes.FETCH_ROLE_PERMISSIONS_SUCCESS:
    case UserTypes.FETCH_ROLE_USERS_SUCCESS:
      return _assign({}, state,
        { roles: _assign({}, state.roles,
          { selected: _assign({}, state.roles.selected, { loading: false }, { ...action.payload })}
        )});

    case UserTypes.EXECUTE_ROLE_ACTION:
      return _assign({}, state,
        { roles: _assign({}, state.roles, { action: { name: action.payload.action, loading: true }})});

    case UserTypes.EXECUTE_ROLE_ACTION_ERROR:
      return _assign({}, state,
        { roles: _assign({}, state.roles, { action: { error: action.payload.error, loading: true }})});

    case UserTypes.EXECUTE_ROLE_ACTION_SUCCESS:
      return _assign({}, state,
        { roles: _assign({}, state.roles, { action: { name: action.payload.action, loading: false }})});

    default:
      return state;
  }
}

export const isLoadingUser = (state: UserState) => state.user.loading;
export const getUsersState = (state: UserState) => state.users;
export const getUsers = (state: UserState) => state.users.items;
export const getUserState = (state: UserState) => state.user;
export const getRoles = (state: UserState) => state.roles;
export const getRoleActionState = (state: UserState) => state.roles.action;
