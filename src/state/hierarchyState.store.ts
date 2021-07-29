import {
	ApiResponse,
	DataPaginated,
	ErrorResponse,
	Link,
	NodePath,
	TEditor,
	TreeView
} from '../types';
import { HierarchyClient as axios } from '../util/axios';
import createStore from '../util/immer';

// const getSelfLink = (links: Link[]): Link | undefined =>
// 	links.find(l => l.rel === 'self');

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

interface HierarchyState {
	defaultExpandLevel: number;
	loading: boolean;
	error: string | null;
	activeNodeId: number;
	hierarchyData: TreeView[];
	setLoading: (val: boolean) => void;
	setError: (err: string) => void; // ??
	loadApplication: (applicationId: string) => void;
	initializeHierarchyState: (defaultExpandLevel?: number) => void;
	toggleCollapse: (nodePath: NodePath[], val: boolean) => void;
	toggleEdit: (nodePath: NodePath[], val: boolean) => void;
	toggleNewEditor: (nodePath: NodePath[], val: TEditor) => void;
	setSaving: (nodePath: NodePath[], val: boolean) => void;
	setLoadingChildren: (node: NodePath[], val: boolean) => void;
	setNodeError: (
		nodePath: NodePath[],
		val: string | ErrorResponse | null,
	) => void;

	createApplicationGroup: (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
	) => void;
	editApplicationGroup: (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
	) => void;
	createApplication: (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => void;
	editApplication: (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => void;
	getUserApplication: () => void;
}

interface THierarchyChildDataResp {
	err: ErrorResponse | null;
	children: TreeView[];
}

const getNodeToUpdate = (
	hierarchyData: TreeView[],
	nodePath: NodePath[],
): TreeView => {
	let node: TreeView = hierarchyData[0];
	for (let i = 1; i < nodePath.length; i += 1) {
		if (node.childrenData) {
			const nodeToUpdate = node?.childrenData.find(
				pn => pn.id === nodePath[i].pathId,
			);
			if (nodeToUpdate) node = nodeToUpdate;
		}
	}
	return node;
};

const getHierarchyChildData = async (
	data: TreeView,
): Promise<THierarchyChildDataResp> => {
	let err: ErrorResponse | null = null;
	let childrenData: TreeView[] = [];

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
						const { items } = res?.data?.data;
						childrenData = items.map((obj: TreeView) => ({
							...obj,
							collapsed: true,
							toggleNewEditor: '',
							saving: false,
							loadingChildren: false,
							edit: false,
							error: null,
						}));
					} else err = resp as unknown as ErrorResponse; // break here;
				});
			}
		}
	}

	return Promise.resolve({ err, children: childrenData });
};

const updateNodeValues = (node: TreeView, name: string, value: string) => {
	if (node) {
		node.name = name;
		node.value = value;
		node.saving = false;
		node.toggleNewEditor = '';
		node.loadingChildren = false;
		node.edit = false;
		node.error = null;
	}
};

const nodeErrorHandler = (err: ErrorResponse, data: TreeView) => {
	data.loadingChildren = false;
	data.error = err.errors?.[0];
	data.saving = false;
};

const updateChildrenHandler = (data: TreeView, children: TreeView[]) => {
	data.childrenData = [...children];
	data.loadingChildren = false;
	data.collapsed = false;
	data.toggleNewEditor = '';
	data.saving = false;
};

function nodeUpdateState(
	set: any,
	nodePath: NodePath[],
	err: ErrorResponse | null,
	children: TreeView[],
) {
	set((state: HierarchyState) => {
		const node = getNodeToUpdate(state.hierarchyData, nodePath);

		if (err) {
			nodeErrorHandler(err, node);
		} else {
			updateChildrenHandler(node, children);
			// set breadcrumb here
		}
	});
}

const HierarchyStore = (set: any, get: any): HierarchyState => ({
	loading: false,
	error: '',
	defaultExpandLevel: 0,
	activeNodeId: 0,
	hierarchyData: [],
	setLoading: (val: boolean) =>
		set((state: HierarchyState) => {
			state.loading = val;
		}),
	setLoadingChildren: (nodePath, val: boolean) => {
		set((state: HierarchyState) => {
			const node = getNodeToUpdate(state.hierarchyData, nodePath);
			node.loadingChildren = val;
		});
	},
	setError: (err: string) =>
		set((state: HierarchyState) => {
			state.error = err;
		}),
	initializeHierarchyState: (defaultExpandLevel?: number) =>
		set((state: HierarchyState) => {
			state.activeNodeId = 1;
			state.defaultExpandLevel = defaultExpandLevel || 0;
		}),
	loadApplication: async (applicationId: string) => {
		const res = await axios
			.get<ApiResponse<TreeView>>(`applications/${applicationId}`)
			.catch((reason: ErrorResponse) => {
				get().setError(reason.errors[0]);
			});

		if (res) {
			const applicationData = res.data.data;

			const childrenLink = getChildrenLink(applicationData?._links || []);
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
							{
								...applicationData,
								toggleNewEditor: '',
								error: null,
								saving: false,
								edit: false,
								loadingChildren: false,
								childrenData: resGroup?.data?.data.items.map(i => ({
									...i,
									collapsed: true,
								})),
								collapsed: false, // this needs to be based on default expand
							},
						];
					});
				}
			}
		}
		return set((state: HierarchyState) => {
			state.loading = false;
		});
	},
	toggleCollapse: async (nodePath: NodePath[], val: boolean) => {
		const data = getNodeToUpdate(get().hierarchyData, nodePath);

		if (!val) {
			get().setLoadingChildren(nodePath, true);
			const { err, children }: THierarchyChildDataResp =
				await getHierarchyChildData(data);

			nodeUpdateState(set, nodePath, err, children);
		} else {
			set((state: HierarchyState) => {
				const node = getNodeToUpdate(state.hierarchyData, nodePath);
				node.collapsed = val;
			});
		}
	},
	toggleEdit: (nodePath: NodePath[], val: boolean) => {
		set((state: HierarchyState) => {
			const node = getNodeToUpdate(state.hierarchyData, nodePath);

			node.edit = val;
			node.error = null;
		});
	},
	toggleNewEditor: (nodePath: NodePath[], val: TEditor) => {
		set((state: HierarchyState) => {
			const node = getNodeToUpdate(state.hierarchyData, nodePath);
			node.toggleNewEditor = val;
			node.collapsed = false;
			node.error = null;
		});
	},
	setSaving: (nodePath: NodePath[], val: boolean) => {
		set((state: HierarchyState) => {
			const node = getNodeToUpdate(state.hierarchyData, nodePath);
			node.saving = val;
		});
	},
	setNodeError: (nodePath: NodePath[], val) => {
		let err: string | null;
		if (val === null) err = null;
		else if (typeof val === 'string') err = val;
		else err = val.errors[0]?.[0];

		set((state: HierarchyState) => {
			const node = getNodeToUpdate(state.hierarchyData, nodePath);
			node.error = err;
		});
	},
	createApplicationGroup: async (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
	) => {
		if (data) {
			let remoteError: ErrorResponse | null = null;
			get().setSaving(nodePath, true);
			const link: Link | undefined = getCreateGroupLink(data?._links || []);

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name },
				}).catch((reason: ErrorResponse) => {
					remoteError = reason;
				});

				if (remoteError) {
					nodeUpdateState(set, nodePath, remoteError, []);
				} else if (resp && resp.status === 201) {
					const { err, children }: THierarchyChildDataResp =
						await getHierarchyChildData(data);

					nodeUpdateState(set, nodePath, err, children);
				}
			}
		}
	},
	editApplicationGroup: async (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
	) => {
		if (data) {
			let remoteError: ErrorResponse | null = null;
			get().setSaving(nodePath, true);
			const link: Link | undefined = getSelfUpdateLink(data._links || [], true);

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name },
				}).catch(reason => {
					remoteError = reason as unknown as ErrorResponse;
				});

				if (remoteError) {
					nodeUpdateState(set, nodePath, remoteError, []);
				} else if (resp && resp.status === 200) {
					set((state: HierarchyState) => {
						const node = getNodeToUpdate(state.hierarchyData, nodePath);
						updateNodeValues(node, name, '');
					});
				}
			}
		}
	},
	createApplication: async (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => {
		if (data) {
			let remoteError: ErrorResponse | null = null;
			get().setSaving(nodePath, true);
			const link: Link | undefined = getCreateApplicationLink(
				data?._links || [],
			);

			if (link) {
				const { method, href } = link;
				const resp = await axios({
					method: method.method,
					url: href,
					data: { name, value },
				}).catch((reason: ErrorResponse) => {
					remoteError = reason;
				});
				if (remoteError) {
					nodeUpdateState(set, nodePath, remoteError, []);
				} else if (resp && resp.status === 201) {
					const { err, children }: THierarchyChildDataResp =
						await getHierarchyChildData(data);

					nodeUpdateState(set, nodePath, err, children);
				}
			}
		}
	},
	editApplication: async (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => {
		if (data) {
			let remoteError: ErrorResponse | null = null;
			get().setSaving(nodePath, true);
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
					remoteError = reason as unknown as ErrorResponse;
				});

				if (remoteError) {
					nodeUpdateState(set, nodePath, remoteError, []);
				} else if (resp && resp.status === 200) {
					set((state: HierarchyState) => {
						const node = getNodeToUpdate(state.hierarchyData, nodePath);
						updateNodeValues(node, name, value);
					});
				}
			}
		}
	},
	getUserApplication: async () => {
		get().setLoading(true);
		await get().loadApplication(get().activeNodeId);
	},
});

/* eslint-disable import/prefer-default-export */
export const useHierarchyStore = createStore<HierarchyState>(HierarchyStore);



