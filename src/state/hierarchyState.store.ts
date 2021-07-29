import {
	ApiResponse,
	DataPaginated,
	ErrorResponse,
	Link,
	NodePath,
	TEditor,
	TreeView,
} from '../types';
import { HierarchyClient as axios } from '../util/axios';
import createStore from '../util/immer';
import {
	getChildrenLink,
	getCreateApplicationLink,
	getCreateGroupLink,
	getHierarchyChildData,
	getNodeToUpdate,
	getSelfUpdateLink,
	HierarchyState,
	nodeUpdateState,
	THierarchyChildDataResp,
	updateNodeValues,
} from './helpers/hierarchy.store.helper';

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
