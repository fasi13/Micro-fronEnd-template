

import { CultureActionTypes,  CultureAction } from './culture.actions';

export interface CultureState {
  currentCulture: string;
  availableCultures: string[];
}
export const initialState: CultureState = { currentCulture : null , availableCultures : [] };

export function reducer(state: CultureState = initialState, action: CultureAction): CultureState {

  switch (action.type) {
      case CultureActionTypes.READ_CULTURE_SUCCESS:
       return {...state, currentCulture : action.payload.cultureCode};
       case CultureActionTypes.READ_AVAILABLE_CULTURES_SUCCESS:
        return {...state, availableCultures : action.payload.availableCultures};
       default:
      return state;
  }
}

/**
 * Returns the current application info.
 * @function getCurrentCulture
 * @param {State} state
 * @returns {string}
 */
export const getCurrentCulture = (state: CultureState) => state.currentCulture;
export const getAvailableCultures = (state: CultureState) => state.availableCultures;


