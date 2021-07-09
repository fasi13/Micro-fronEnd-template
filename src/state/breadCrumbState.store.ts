import { NodePath } from '../types';
import createStore from '../util/immer';

interface BreadcrumbState {
	breadCrumbData: NodePath[];
	setBreadcrumb: (val: NodePath[]) => void;
}

const BreadcrumbStore = (set: any): BreadcrumbState => ({
	breadCrumbData: [{ pathId: -1, pathName: 'E2E Group' }],
	setBreadcrumb: (val: NodePath[]) =>
		set((state: BreadcrumbState) => {
			state.breadCrumbData = val;
		}),
});

export const useBreadcrumbStore = createStore<BreadcrumbState>(BreadcrumbStore);
