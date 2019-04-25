import _assign from 'lodash/assign';
import { Action } from '@ngrx/store';

export abstract class FgeStoreAction<T = any> implements Action {

  public payload: T;
  public type: string;

  constructor(type: string, data: T, defaultData: T = {} as T) {
    this.payload = _assign({}, defaultData, data);
    this.type = type;
  }
}
