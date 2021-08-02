import { NodePath } from '../types';
import createStore from '../util/immer';

interface BreadcrumbState {
	breadCrumbData: NodePath[];
	setBreadCrumb: (val: NodePath[]) => void;
}

const BreadcrumbStore = (set: any): BreadcrumbState => ({
	breadCrumbData: [],
	setBreadCrumb: (val: NodePath[]) =>
		set((state: BreadcrumbState) => {
			state.breadCrumbData = val;
		}),
});

export const useBreadcrumbStore = createStore<BreadcrumbState>(BreadcrumbStore);
