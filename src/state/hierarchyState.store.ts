import {
	ApiResponse,
	Application,
	ApplicationResponse,
	DataPaginated,
	Link,
	TreeView
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

// const isNodeApplication = (links: Link[] | undefined): boolean => {
// 	if (links) return !links.find(l => l.rel === 'createApplication');
// 	return false;
// };

// const isNodeGroup = (links: Link[] | undefined): boolean => {
// 	if (links && links.find(l => l.rel === 'createApplication')) return true;

// 	return false;
// };

const updateNodeWithChildren = (
	node: TreeView,
	children: TreeView[],
): TreeView[] => {
	if (node && node?.childrenData) {
		return [...node?.childrenData, ...children];
	}
	return [...children];
};

interface HierarchyState {
	rootApplication: Application | null;
	loading: boolean;

	activeNodeId: number;
	hierarchyData: TreeView[];
	// childrenData: TreeView[];

	newChange: string;

	setNewChange: (value: string) => void;
	setLoading: (val: boolean) => void;

	loadApplication: (applicationId: string) => void;
	loadGroup: () => void;

	initializeHierarchyState: () => void;
	updateHierarchyStore: (
		newNode: ApplicationResponse,
		isGroup: boolean,
	) => void;
	createApplicationGroup: (
		data: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
	) => void;
	editApplicationGroup: (
		data: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
	) => void;
	createApplication: (
		data: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
		value: string,
	) => void;
	editApplication: (
		data: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
		value: string,
	) => void;
	getUserApplication: () => void;
	getHierarchyChildData: (
		item: TreeView,
		nodeId: number,
		nodePath: number[],
	) => void;
}

function updateNodeWithNewChildData(
	hierarchyData: TreeView[],
	nodePath: number[],
	items: any[],
) {
	let i = 1;
	let parentNode: TreeView = hierarchyData[0];
	while (i <= nodePath.length - 1) {
		if (parentNode.childrenData) {
			// eslint-disable-next-line no-loop-func
			const p = parentNode?.childrenData.find(
				// eslint-disable-next-line no-loop-func
				pn => pn.id === nodePath[i],
			);
			if (p) parentNode = p;
		}
		i += 1;
	}

	if (parentNode) {
		const childrenData = updateNodeWithChildren(parentNode, items);
		parentNode.childrenData = [...childrenData];
	}
}

function updateNodeValues(
	hierarchyData: TreeView[],
	nodePath: number[],
	name: string,
	value: string,
) {
	let i = 1;
	let parentNode: TreeView = hierarchyData[0];
	while (i <= nodePath.length - 1) {
		if (parentNode.childrenData) {
			// eslint-disable-next-line no-loop-func
			const p = parentNode?.childrenData.find(
				// eslint-disable-next-line no-loop-func
				pn => pn.id === nodePath[i],
			);
			if (p) parentNode = p;
		}
		i += 1;
	}

	if (parentNode) {
		parentNode.name = name;
		parentNode.value = value;
	}
}


const HierarchyStore = (set: any, get: any): HierarchyState => ({
	rootApplication: null,
	loading: false,
	activeNodeId: 0,
	hierarchyData: [],
	// childrenData: [],
	newChange: '',
	setNewChange: (value: string) =>
		set((state: HierarchyState) => {
			state.newChange = value;
		}),
	setLoading: (val: boolean) =>
		set((state: HierarchyState) => {
			state.loading = val;
		}),
	loadApplication: async (applicationId: string) => {
		const res = await axios.get<ApiResponse<TreeView>>(
			`applications/${applicationId}`,
		);

		if (res) {
			const applicationData = res.data.data;

			const childrenLink = loadChildren(applicationData?._links || []);
			const childrenGroupLink: Link | undefined = childrenLink?.find(
				c => c.rel === 'applicationGroups',
			);

			if (childrenGroupLink) {
				const resGroup = await axios.get<ApiResponse<DataPaginated<TreeView>>>(
					childrenGroupLink?.href,
				);

				if (resGroup) {
					set((state: HierarchyState) => {
						state.loading = false;
						state.hierarchyData = [
							{ ...applicationData, childrenData: resGroup?.data?.data.items },
						];
					});
				}
			}
		}
		return set((state: HierarchyState) => {
			state.loading = false;
		});
	},
	loadGroup: () => {
		console.log('wee');
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
	createApplicationGroup: async (
		data: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
	) => {
		if (data) {
			const link: Link = getAction(data, 'createApplicationGroup');

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name },
				});
				if (resp && resp.status === 201)
					await get().getHierarchyChildData(data, nodeId, nodePath);
				else console.log('Handle Error Here');
			}
		}
	},
	editApplicationGroup: async (
		data: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
	) => {
		if (data) {
			const link: Link | undefined = getSelfUpdateLink(
				data._links || [],
				true
			);

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name },
				});
				if (resp && resp.status === 200) {
					set((state: HierarchyState) => {
						const { hierarchyData } = state;
						updateNodeValues(hierarchyData, nodePath, name,           '');
					});
				}
			}
		}
	},
	createApplication: async (
		data: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
		value: string,
	) => {
		if (data) {
			const link: Link = getAction(data, 'createApplication');

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name, value },
				});
				if (resp && resp.status === 201) {
					await get().getHierarchyChildData(data, nodeId, nodePath);
				}
			}
		}
	},
	editApplication: async (
		data: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
		value: string,
	) => {
		if (data) {
			const link: Link | undefined = getSelfUpdateLink(
				data._links || [],
				false,
			);

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name, value },
				});
				if (resp && resp.status === 200) {
					set((state: HierarchyState) => {
						const { hierarchyData } = state;
						updateNodeValues(hierarchyData, nodePath, name, value);
					});
				}
			}
		}
	},
	getUserApplication: async () => {
		get().setLoading(true);
		// const response = await axios.get<ApiResponse<string>>(`applications`);
		// if (response && response.status === 200){
		// 	 await get().loadApplication(response.data);
		// }
		await get().loadApplication(1);
	},
	// eslint-disable-next-line sonarjs/cognitive-complexity
	getHierarchyChildData: async (
		data: TreeView,
		nodeId: number,
		nodePath: number[],
		// eslint-disable-next-line sonarjs/cognitive-complexity
	) => {
		if (data._links) {
			const links = loadChildren(data._links);
			if (links) {
				const resp = await Promise.all(
					links.map(async link => {
						const { method, href } = link;
						return axios({
							method: method.method,
							url: href,
						});
					}),
				);
				if (resp) {
					resp.forEach(res => {
						if (res.status === 200) {
							set((state: HierarchyState) => {
								const { hierarchyData } = state;
								const { items } = res?.data?.data;

								updateNodeWithNewChildData(hierarchyData, nodePath, items);
							});
						} else console.log('Report Error here');
					});
				}
			}
		}
		set((state: HierarchyState) => {
			state.loading = false;
		});
	},
});

/* eslint-disable import/prefer-default-export */
export const useHierarchyStore = createStore<HierarchyState>(HierarchyStore);


