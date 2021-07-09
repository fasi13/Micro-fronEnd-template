import createStore from '../util/immer';

interface BreadcrumbState {
	breadCrumbData: string[];
	setBreadcrumb: (val: string[]) => void;
}

const BreadcrumbStore = (set: any): BreadcrumbState => ({
	breadCrumbData: ['E2E Group'],
	setBreadcrumb: (val: string[]) =>
		set((state: BreadcrumbState) => {
			state.breadCrumbData = val;
		}),
});

export const useBreadcrumbStore = createStore<BreadcrumbState>(BreadcrumbStore);
