import _assign from 'lodash/assign';

export abstract class ResponseParameter<T = any> {

  payload: T;

  constructor(model: T, defaultParameter: T) {
    this.payload = _assign(model, defaultParameter);
  }
}
