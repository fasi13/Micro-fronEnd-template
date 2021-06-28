import { MfeOption } from '../types';
import createStore from '../util/immer';

interface MfeOptionState {
	activeIndex: number;
	mfeOptions: MfeOption[];
	getMfeOptions: () => void;
	addMfeOptions: (description: string, logo: string, order: number) => void;
	changeOrder: (order: number) => void;
	initializeMfeOptions: (activeIndex: number) => void;
}

const mfeOptionsStore = (set: any): MfeOptionState => ({
	activeIndex: 0,
	mfeOptions: [],
	getMfeOptions: async () => {
		console.log('e');
	},
	addMfeOptions: (description: string, logo: string, order: number) =>
		set((state: MfeOptionState) => {
			state.mfeOptions.push({ description, logo, order });
		}),
	changeOrder: (order: number) =>
		set((state: MfeOptionState) => {
			state.mfeOptions[0].order = order;
		}),
	initializeMfeOptions: (_activeIndex: number) =>
		set((state: MfeOptionState) => {
			state.activeIndex = _activeIndex || 0;
			state.mfeOptions = [{ description: 'A', logo: 'a.jpg', order: 0 }];
		}),
});

/* eslint-disable import/prefer-default-export */
export const useMfeOptionsStore = createStore<MfeOptionState>(mfeOptionsStore);
