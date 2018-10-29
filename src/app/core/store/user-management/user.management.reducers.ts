import _assign from 'lodash/assign';

import { NewUser, UpdateUser } from '../../models';
import { UserManagementTypes, UserManagementAcctions } from './user-management.actions';

export interface UserManagementStade {
    loaded: boolean;
    loading: boolean;
    creatingUser: boolean;
    createdUser: boolean;
    error?: string;
}

const initialState: UserManagementStade = {
    loaded: false,
    loading: false,
    creatingUser: false,
    createdUser: false
};

export function reducer(state: any = initialState, action: UserManagementAcctions): UserManagementStade {
    switch (action.type) {
        case UserManagementTypes.NEW_USER:
          return Object.assign({}, state, {
            error: undefined,
            creatingUser: true
          });

        case UserManagementTypes.NEW_USER_ERROR:
          return Object.assign({}, state, {
            createdUser: false,
            error: action.payload.error
          });

        case UserManagementTypes.NEW_USER_SUCCESS:
          return Object.assign({}, state, {
            createdUser: true
          });

        default:
          return state;
      }
}

/**
 * Returns true if request is in progress.
 * @function isNewUserCreating
 * @param {State} state
 * @returns {boolean}
 */
export const isNewUserCreating = (state: UserManagementStade) => state.creatingUser;
​
/**
 * Returns true if the password has reseted.
 * @function isNewUserCreated
 * @param {State} state
 * @returns {boolean}
 */
export const isNewUserCreated = (state: UserManagementStade) => state.createdUser;
​
/**
 * Returns the reset password error.
 * @function getNewUserError
 * @param {State} state
 * @returns {Error}
 */
export const getNewUserError = (state: UserManagementStade) => state.error;
