import _mapValues from 'lodash/mapValues';
import _keyBy from 'lodash/keyBy';
import _lowerCase from 'lodash/lowerCase';

import { State } from './store.reducers';
import { User, UserToken, Link, MappedLinks } from '../models';

const typeCache: { [label: string]: boolean } = {};
export function ActionType<T>(label: T | string): T {
  if (typeCache[<string>label]) {
    throw new Error(`Action type ${label} is already registered`);
  }

  typeCache[<string>label] = true;

  return <T>label;
}

export function mapLinks(_links: Link[]): MappedLinks {
  return _mapValues(_keyBy(_links, 'rel'), ({ href, method } : Link) => (
    {
      href,
      method: _lowerCase(method.method)
    }
  ));
}

export function loadFromLocalStorage() {
  let user: User = JSON.parse(localStorage.getItem('user'));
  const token: UserToken = localStorage.getItem('token');
  if (user) {
    user = { ...user, actions: mapLinks(user._links) };
  }
  const currentState: State = {
    router: null,
    authorization: {
      authenticated: !!token && !!user,
      loaded: false,
      loading: false,
      user
    }
  };
  return currentState;
}
