import produce from 'immer';
import create, { State, StateCreator, UseStore } from 'zustand';
import { devtools } from 'zustand/middleware';

const immer =
	<T extends State>(config: StateCreator<T>): StateCreator<T> =>
	(set, get, api) =>
		config(
			(partial, replace) => {
				const nextState =
					typeof partial === 'function'
						? produce(partial as (state: T) => T)
						: (partial as T);
				return set(nextState, replace);
			},
			get,
			api,
		);

export default function createStore<T extends State>(store: any): UseStore<T> {
	return create<T>(devtools(immer<T>(store)));
}
