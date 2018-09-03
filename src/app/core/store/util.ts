import { State } from "./store.reducers";
import { User, UserToken } from "../models";

const typeCache: { [label: string]: boolean } = {};
export function ActionType<T>(label: T | string): T {
  if (typeCache[<string>label]) {
    throw new Error(`Action type ${label} is already registered`);
  }

  typeCache[<string>label] = true;

  return <T>label;
}

export function loadFromLocalStorage() {
  const user: User = JSON.parse(localStorage.getItem('user'));
  const token: UserToken = localStorage.getItem('token');
  const currentState: State = {
    router: null,
    authorization: {
      authenticated: !!token && !!user,
      loaded: false,
      loading: false,
      user
    }
  }
  return currentState;
}