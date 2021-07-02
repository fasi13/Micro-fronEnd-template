import {
	ApiResponse,
	Application,
	ApplicationResponse,
	Link,
	TreeView,
} from '../types';
import { HierarchyClient as axios } from '../util/axios';
import createStore from '../util/immer';

const getSelfLink = (links: Link[]): Link | undefined =>
	links.find(l => l.rel === 'self');

const getSelfUpdateLink = (links: Link[], isGroup: boolean): Link | undefined =>
	isGroup
		? links.find(l => l.rel === 'updateApplicationGroup')
		: links.find(l => l.rel === 'updateApplication');

const getCreateGroupLink = (links: Link[]): Link | undefined =>
	links.find(l => l.rel === 'createApplicationGroup');

const getCreateApplicationLink = (links: Link[]): Link | undefined =>
	links.find(l => l.rel === 'createApplication');

const loadChildren = (links: Link[]): Link[] | undefined =>
	links.filter(l => l.rel === 'applications' || l.rel === 'applicationGroups');

interface HierarchyState {
	rootApplication: Application | null;
	loading: boolean;
	activeNodeId: number;
	hierarchyData: TreeView[];
	setLoading: (val: boolean) => void;
	loadApplication: () => void;
	loadGroup: () => void;
	updateApplication: (node: TreeView) => void;
	createItem: (name: string, group: TreeView, isGroup: boolean) => void;
	searchTreeView: (name: string) => void;
	initializeHierarchyState: () => void;
	updateHierarchyStore: (
		newNode: ApplicationResponse,
		isGroup: boolean,
	) => void;
}

const HierarchyStore = (set: any, get: any): HierarchyState => ({
	rootApplication: null,
	loading: false,
	activeNodeId: 0,
	hierarchyData: [],
	setLoading: (val: boolean) =>
		set((state: HierarchyState) => {
			state.loading = val;
		}),
	loadApplication: async () => {
		const res = await axios.get<ApiResponse<ApplicationResponse>>(
			`applications/${get().activeNodeId}`,
		);
		if (res) {
			const applicationData = res?.data?.data;
			return set((state: HierarchyState) => {
				state.loading = false;
				state.updateHierarchyStore(applicationData, false);
			});
		}
		return set((state: HierarchyState) => {
			state.loading = false;
		});
	},
	loadGroup: () => {
		console.log('wee');
	},
	updateApplication: (node: TreeView) => {
		console.log('wee', node);
	},
	createItem: async (name: string, group: TreeView, isGroup: boolean) => {
		console.log('wee', name, group, isGroup);
	},
	searchTreeView: (name: string) => {
		// what is the search URL ?
		console.log(name);
	},
	initializeHierarchyState: () =>
		set((state: HierarchyState) => {
			state.activeNodeId = 1;
		}),
	updateHierarchyStore: (newNode: ApplicationResponse, isGroup: boolean) => {
		if (!newNode.parentApplicationId && !newNode.applicationGroupId) {
			// this is parent
			set((state: HierarchyState) => {
				state.hierarchyData.length = 0;
				state.hierarchyData.push({
					id: newNode.id,
					name: newNode.name,
					value: newNode.value,
					executedFetch: true,
					isGroup: false,
					childrenData: [],
					loading: false,
					selfLink: getSelfLink(newNode._links),
					selfUpdateLink: getSelfUpdateLink(newNode._links, isGroup),
					createGroupLink: getCreateGroupLink(newNode._links),
					createApplicationLink: getCreateApplicationLink(newNode._links),
					loadChildrenLink: loadChildren(newNode._links),
					edit: false,
				});
			});
		}
	},

	// updateHierarchyStoreWithSelfDetail: (nodeDetail: ApplicationResponse) => {

	// }

	// updateHierarchyStoreWithApplicationGroups: (
	// 	newNode: DataPaginated<ApplicationGroupResponse>,
	// ) => {},

	// updateHierarchyStoreWithApplications: (
	// 	newNode: DataPaginate<ApplicationResponse>,
	// ) => {},
});

/* eslint-disable import/prefer-default-export */
export const useHierarchyStore = createStore<HierarchyState>(HierarchyStore);

export {};

