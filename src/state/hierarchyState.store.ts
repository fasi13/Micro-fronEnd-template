import {
	ApiResponse,
	ApplicationResponse,
	ErrorResponse,
	Link,
	NodePath,
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

const getChildrenLink = (links: Link[]): Link[] | undefined =>
	links.filter(l => l.rel === 'applications' || l.rel === 'applicationGroups');

const updateNodeWithChildren = (
	node: TreeView,
	children: TreeView[],
): TreeView[] => [...children];

interface HierarchyState {
	loading: boolean;
	error: string | null;
	activeNodeId: number;
	hierarchyData: TreeView[];
	setLoading: (val: boolean) => void;
	setError: (err: string) => void;
	loadApplication: (applicationId: string) => void;

	initializeHierarchyState: () => void;
	updateHierarchyStore: (
		newNode: ApplicationResponse,
		isGroup: boolean,
	) => void;
	createApplicationGroup: (
		data: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		name: string,
		cb: (err: ErrorResponse | null) => void,
	) => void;
	editApplicationGroup: (
		data: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		name: string,
		cb: (err: ErrorResponse | null) => void,
	) => void;
	createApplication: (
		data: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		name: string,
		value: string,
		cb: (err: ErrorResponse | null) => void,
	) => void;
	editApplication: (
		data: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		name: string,
		value: string,
		cb: (err: ErrorResponse | null) => void,
	) => void;
	getUserApplication: () => void;
	getHierarchyChildData: (
		item: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		cb: (err: ErrorResponse | null) => void,
	) => void;
}

const updateNodeWithNewChildData = (
	hierarchyData: TreeView[],
	nodePath: NodePath[],
	items: any[],
) => {
	let parentNode: TreeView = hierarchyData[0];

	for (let i = 1; i < nodePath.length; i += 1) {
		if (parentNode.childrenData) {
			const p = parentNode?.childrenData.find(
				pn => pn.id === nodePath[i].pathId,
			);
			if (p) parentNode = p;
		}
	}

	if (parentNode) {
		const childrenData = updateNodeWithChildren(parentNode, items);
		parentNode.childrenData = [...childrenData];
	}
};

const updateNodeValues = (
	hierarchyData: TreeView[],
	nodePath: NodePath[],
	name: string,
	value: string,
) => {
	let parentNode: TreeView = hierarchyData[0];
	for (let i = 1; i < nodePath.length; i += 1) {
		if (parentNode.childrenData) {
			const p = parentNode?.childrenData.find(
				pn => pn.id === nodePath[i].pathId,
			);
			if (p) parentNode = p;
		}
	}

	if (parentNode) {
		parentNode.name = name;
		parentNode.value = value;
	}
};

const HierarchyStore = (set: any, get: any): HierarchyState => ({
	loading: false,
	error: '',
	activeNodeId: 0,
	hierarchyData: [],
	setLoading: (val: boolean) =>
		set((state: HierarchyState) => {
			state.loading = val;
		}),
	setError: (err: string) =>
		set((state: HierarchyState) => {
			state.error = err;
		}),
	loadApplication: async (applicationId: string) => {
		const res = await axios
			.get<ApiResponse<TreeView>>(`applications/${applicationId}`)
			.catch((reason: ErrorResponse) => {
				get().setError(reason);
			});

		if (res) {
			const applicationData = res.data.data;

			set((state: HierarchyState) => {
				state.loading = false;
				state.hierarchyData = [{ ...applicationData }];
			});
		}
		return set((state: HierarchyState) => {
			state.loading = false;
		});
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
					loadChildrenLink: getChildrenLink(newNode._links),
				});
			});
		}
	},
	createApplicationGroup: async (
		data: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		name: string,
		cb,
	) => {
		let err: ErrorResponse | null = null;
		if (data) {
			const link: Link | undefined = getCreateGroupLink(data?._links || []);

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name },
				}).catch(reason => {
					err = reason;
				});
				if (resp && resp.status === 201)
					await get().getHierarchyChildData(data, nodeId, nodePath, cb);
			}
		}
		cb(err);
	},
	editApplicationGroup: async (
		data: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		name: string,
		cb,
	) => {
		let err: ErrorResponse | null = null;
		if (data) {
			const link: Link | undefined = getSelfUpdateLink(data._links || [], true);

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name },
				}).catch(reason => {
					err = reason as unknown as ErrorResponse;
				});
				if (resp && resp.status === 200) {
					set((state: HierarchyState) => {
						const { hierarchyData } = state;
						updateNodeValues(hierarchyData, nodePath, name, '');
					});
				}
			}
		}
		cb(err);
	},
	createApplication: async (
		data: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		name: string,
		value: string,
		cb,
	) => {
		let err: ErrorResponse | null = null;
		if (data) {
			const link: Link | undefined = getCreateApplicationLink(
				data?._links || [],
			);

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name, value },
				}).catch(reason => {
					err = reason;
				});
				if (resp && resp.status === 201) {
					await get().getHierarchyChildData(data, nodeId, nodePath, cb);
				}
			}
		}
		cb(err);
	},
	editApplication: async (
		data: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		name: string,
		value: string,
		cb,
	) => {
		let err: ErrorResponse | null = null;

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
				}).catch(reason => {
					err = reason as unknown as ErrorResponse;
				});
				if (resp && resp.status === 200) {
					set((state: HierarchyState) => {
						const { hierarchyData } = state;
						updateNodeValues(hierarchyData, nodePath, name, value);
					});
				}
			}
		}
		cb(err);
	},
	getUserApplication: async () => {
		get().setLoading(true);
		await get().loadApplication(get().activeNodeId);
	},
	getHierarchyChildData: async (
		data: TreeView,
		nodeId: number,
		nodePath: NodePath[],
		cb,
	) => {
		let err: ErrorResponse | null = null;

		if (data._links) {
			const links = getChildrenLink(data._links);
			if (links) {
				const resp = await Promise.all(
					links.map(async link => {
						const { method, href } = link;
						return axios({
							method: method.method,
							url: href,
						});
					}),
				).catch(reason => {
					err = reason as unknown as ErrorResponse;
				});
				if (resp) {
					resp.forEach(res => {
						if (res.status === 200) {
							set((state: HierarchyState) => {
								const { hierarchyData } = state;
								const { items } = res?.data?.data;

								updateNodeWithNewChildData(hierarchyData, nodePath, items);
							});
						} else err = resp as unknown as ErrorResponse; // break here;
					});
				}
			}
		}
		set((state: HierarchyState) => {
			state.loading = false;
		});

		cb(err || null);
	},
});

/* eslint-disable import/prefer-default-export */
export const useHierarchyStore = createStore<HierarchyState>(HierarchyStore);
