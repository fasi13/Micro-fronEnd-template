import _assign from 'lodash/assign';

import { ResetPasswordTypes, ResetPasswordActions} from './reset-password.actions';

export interface ResetPasswordState {
  resetPassword: {
    loading: boolean,
    error?: any;
  };
}

const initialState: ResetPasswordState = {
  resetPassword: {
    loading: false,
    error: null
  }
};

export function reducer(state: ResetPasswordState = initialState, action: ResetPasswordActions): ResetPasswordState {
  switch (action.type) {
    case ResetPasswordTypes.RESET_PASSWORD:
      return _assign({}, state, {
        resetPassword: {
          loading: true
        }
      });

    case ResetPasswordTypes.RESET_PASSWORD_ERROR:
      return _assign({}, state, {
        resetPassword: {
          loading: false,
          error: action.payload.error
        }
      });

    case ResetPasswordTypes.RESET_PASSWORD_SUCCESS:
      return _assign({}, state, {
        resetPassword: {
          loading: false,
          error: null
        }
      });

    default:
      return state;
  }
}

export const isResetPasswordLoading = (state: ResetPasswordState) => state.resetPassword.loading;
export const getResetPassword = (state: ResetPasswordState) => state.resetPassword;
