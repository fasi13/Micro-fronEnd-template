import _assign from 'lodash/assign';

import { ResetPasswordTypes, ResetPasswordActions} from './reset-password.actions';

export interface ResetPasswordState {
  resetPassword: {
    reseting: boolean,
    error?: any;
  };
}

const initialState: ResetPasswordState = {
  resetPassword: {
    reseting: false,
    error: null
  }
};

export function reducer(state: ResetPasswordState = initialState, action: ResetPasswordActions): ResetPasswordState {
  switch (action.type) {
    case ResetPasswordTypes.RESET_PASSWORD:
      return _assign({}, state, {
        resetPassword: {
          reseting: true
        }
      });

    case ResetPasswordTypes.RESET_PASSWORD_ERROR:
      return _assign({}, state, {
        resetPassword: {
          reseting: false,
          error: action.payload.error
        }
      });

    case ResetPasswordTypes.RESET_PASSWORD_SUCCESS:
      return _assign({}, state, {
        resetPassword: {
          reseting: false,
          error: null
        }
      });

    default:
      return state;
  }
}

export const isChangingPassword = (state: ResetPasswordState) => state.resetPassword.reseting;
export const getResetPassword = (state: ResetPasswordState) => state.resetPassword;
