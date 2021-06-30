import {
	ApiResponse,
	Application,
	ApplicationPath,
	ApplicationResponse,
	DataPaginated,
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
const getAction = (data: TreeView, action: string): any => {
	if (data._links) {
		return data._links.find(item => item.rel === action);
	}
	return null;
};
interface HierarchyState {
	rootApplication: Application | null;
	loading: boolean;
	activeNodeId: number;
	hierarchyData: TreeView[];
	searchData: ApiResponse<DataPaginated<ApplicationPath>>[];
	newChange: string;
	searchedKeyWord: string;
	setSearchedData: (item: ApiResponse<DataPaginated<ApplicationPath>>) => void;
	setNewChange: (value: string) => void;
	setLoading: (val: boolean) => void;
	loadApplication: () => void;
	loadGroup: () => void;
	updateApplication: (node: TreeView) => void;
	createItem: (name: string, group: TreeView, isGroup: boolean) => void;
	initializeHierarchyState: () => void;
	updateHierarchyStore: (
		newNode: ApplicationResponse,
		isGroup: boolean,
	) => void;
	createApplicationGroup: (
		data: any,
		actionName: string,
		options?: {
			name?: any;
			params?: {
				[param: string]: string | string[];
			};
		},
	) => void;
	getApplicationGroups: () => void;
	searchApplication: (keyword: string) => void;
}

const HierarchyStore = (set: any, get: any): HierarchyState => ({
	rootApplication: null,
	loading: false,
	activeNodeId: 0,
	hierarchyData: [],
	searchData: [],
	newChange: '',
	searchedKeyWord: '',
	setSearchedData: (item: ApiResponse<DataPaginated<ApplicationPath>>) =>
		set((state: HierarchyState) => {
			state.searchData.push({
				success: item.success,
				data: item.data,
			});
		}),
	setNewChange: (value: string) =>
		set((state: HierarchyState) => {
			state.newChange = value;
		}),
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
				console.log(applicationData);
				state.loading = false;
				state.updateHierarchyStore(applicationData, false);
			});
		}
		return set((state: HierarchyState) => {
			state.loading = false;
		});
	},
	searchApplication: async (keyword: string) => {
		await axios
			.get<ApiResponse<DataPaginated<ApplicationPath>>>(
				`applications/${get().activeNodeId}/paths/?keyword=${keyword}`,
			)
			.then(resp => {
				set((state: HierarchyState) => {
					state.setSearchedData(resp.data);
				});
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
				});
			});
		}
	},
	createApplicationGroup: (
		data: any,
		actionName: string,
		options?: {
			name?: any;
			params?: {
				[param: string]: string | string[];
			};
		},
	): void => {
		if (data) {
			const link: Link = getAction(data, actionName);

			if (link) {
				const { method, href } = link;
				console.log('options', options);
				axios({
					method: method.method,
					url: href,
					data: options,
				}).then(resp => resp.data);
			}
		}
	},
	getApplicationGroups: async () => {
		const response = await axios.get<ApiResponse<DataPaginated<any>>>(
			`applications/${get().activeNodeId}/applicationGroups`,
		);
		if (response) {
			const applicationGroupData = response?.data?.data;
			return set((state: HierarchyState) => {
				state.loading = false;
				state.hierarchyData = applicationGroupData.items;
			});
		}
		return set((state: HierarchyState) => {
			state.loading = false;
		});
	},
});

/* eslint-disable import/prefer-default-export */
export const useHierarchyStore = createStore<HierarchyState>(HierarchyStore);

export {};
