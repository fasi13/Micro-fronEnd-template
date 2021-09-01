import { AxiosError } from 'axios';
import {
	ApiResponse,
	DataPaginated,
	ErrorResponse,
	Link,
	NodePath,
	TEditor,
	TreeView,
} from '../../types';
import {
	ContentDeliveryClient,
	HierarchyClient as axios,
} from '../../util/axios';
import createStore from '../../util/immer';
import {
	getChildrenLink,
	getCreateApplicationLink,
	getCreateGroupLink,
	getSelfUpdateLink,
} from './helpers/hierarchy.link.helper';
import { nodeUpdateState } from './helpers/hierarchy.store.helper';
import {
	getHierarchyChildData,
	getNodeToUpdate,
	updateNodeValues,
} from './helpers/util.help';
import { THierarchyChildDataResp, THierarchyState } from './type';

const unknownError = {
	errorCode: 0,
	errors: ['some error occurred'],
	status: 0,
	title: 'unknown error',
};

const HierarchyStore = (set: any, get: any): THierarchyState => ({
	loading: false,
	error: '',
	defaultExpandLevel: 0,
	activeNodeId: 0,
	hierarchyData: [],
	primaryLogo: '',
	setPrimaryLogo: (val: string) =>
		set((state: THierarchyState) => {
			state.primaryLogo = val;
		}),

	setLoading: (val: boolean) =>
		set((state: THierarchyState) => {
			state.loading = val;
		}),
	setLoadingChildren: (nodePath, val: boolean) => {
		set((state: THierarchyState) => {
			const node = getNodeToUpdate(state.hierarchyData, nodePath);
			if (node) node.loadingChildren = val;
		});
	},
	setError: (err: string) =>
		set((state: THierarchyState) => {
			state.error = err;
		}),
	initializeHierarchyState: (defaultExpandLevel?: number) =>
		set((state: THierarchyState) => {
			state.activeNodeId = 1;
			state.defaultExpandLevel = defaultExpandLevel || 0;
		}),
	loadApplication: async () => {
		const applicationId: string = get().activeNodeId;
		get().setLoading(true);
		const res = await axios
			.get<ApiResponse<TreeView>>(`applications/${applicationId}`)
			.catch((reason: AxiosError<ErrorResponse>) => {
				get().setError(reason?.response?.data?.errors?.[0]);
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
					set((state: THierarchyState) => {
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
		return set((state: THierarchyState) => {
			state.loading = false;
		});
	},
	getPrimaryLogo: async applicationKey => {
		let error: ErrorResponse | null = null;
		if (applicationKey) {
			await ContentDeliveryClient.get(
				`/application/${applicationKey}/content`,
				{
					params: {
						Name: 'Primary Logo',
						Group: 'Website Branding',
					},
				},
			)
				.then(resp => {
					get().setPrimaryLogo(resp?.data?.data?.items?.[0].value);
				})
				.catch(err => {
					error = err as unknown as ErrorResponse;
					console.log(error, 'error');
				});
		}
	},
	toggleCollapse: async (nodePath: NodePath[], val: boolean) => {
		if (!val) {
			const data = getNodeToUpdate(get().hierarchyData, nodePath);
			if (data) {
				get().getPrimaryLogo(data.key);
				get().setLoadingChildren(nodePath, true);
				const { err, children }: THierarchyChildDataResp =
					await getHierarchyChildData(data);
				nodeUpdateState(set, nodePath, err, children);
			}
		} else {
			set((state: THierarchyState) => {
				const node = getNodeToUpdate(state.hierarchyData, nodePath);
				if (node) node.collapsed = val;
			});
		}
	},
	toggleEdit: (nodePath: NodePath[], val: boolean) => {
		set((state: THierarchyState) => {
			const node = getNodeToUpdate(state.hierarchyData, nodePath);
			if (node) {
				node.edit = val;
				node.error = null;
			}
		});
	},
	toggleNewEditor: async (nodePath: NodePath[], val: TEditor) => {
		if (val !== '') {
			const node = getNodeToUpdate(get().hierarchyData, nodePath);
			if (node && node.collapsed) {
				get().getPrimaryLogo(node.key);
				get().setLoadingChildren(nodePath, true);
				const { err, children }: THierarchyChildDataResp =
					await getHierarchyChildData(node);
				nodeUpdateState(set, nodePath, err, children);
			}
		}

		set((state: THierarchyState) => {
			const latestNode = getNodeToUpdate(state.hierarchyData, nodePath);
			if (latestNode) {
				latestNode.toggleNewEditor = val;
				latestNode.error = null;
			}
		});
	},
	setSaving: (nodePath: NodePath[], val: boolean) => {
		set((state: THierarchyState) => {
			const node = getNodeToUpdate(state.hierarchyData, nodePath);
			if (node) node.saving = val;
		});
	},
	setNodeError: (nodePath: NodePath[], val) => {
		let err: string | null;
		if (val === null) err = null;
		else if (typeof val === 'string') err = val;
		else err = val.errors?.[0];

		set((state: THierarchyState) => {
			const node = getNodeToUpdate(state.hierarchyData, nodePath);
			if (node) node.error = err;
		});
	},
	createApplicationGroup: async (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
	) => {
		let createAppRemoteError: ErrorResponse | null = null;
		const link: Link | undefined = getCreateGroupLink(data?._links || []);

		if (link) {
			const { href } = link;
			get().setSaving(nodePath, true);

			const resp = await axios
				.post(href, { name })
				.catch((reason: AxiosError<ErrorResponse>) => {
					createAppRemoteError = reason?.response?.data || unknownError;
				});

			if (createAppRemoteError) {
				nodeUpdateState(set, nodePath, createAppRemoteError, []);
			} else if (resp && resp.status === 201) {
				const { err, children }: THierarchyChildDataResp =
					await getHierarchyChildData(data);

				nodeUpdateState(set, nodePath, err, children);
			} else {
				nodeUpdateState(set, nodePath, unknownError, []);
			}
		}
	},
	editApplicationGroup: async (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
	) => {
		let editApplicationGroupRemoteError: ErrorResponse | null = null;
		const link: Link | undefined = getSelfUpdateLink(data._links || [], true);

		if (link) {
			get().setSaving(nodePath, true);
			const { href } = link;
			const resp = await axios
				.put(href, { name })
				.catch((reason: AxiosError<ErrorResponse>) => {
					editApplicationGroupRemoteError =
						reason.response?.data || unknownError;
				});

			if (editApplicationGroupRemoteError) {
				nodeUpdateState(set, nodePath, editApplicationGroupRemoteError, []);
			} else if (resp && resp.status === 200) {
				set((state: THierarchyState) => {
					const node = getNodeToUpdate(state.hierarchyData, nodePath);
					if (node) updateNodeValues(node, name, '');
				});
			} else {
				nodeUpdateState(set, nodePath, unknownError, []);
			}
		}
	},
	createApplication: async (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => {
		let createApplicationRemoteError: ErrorResponse | null = null;
		const link: Link | undefined = getCreateApplicationLink(data?._links || []);

		if (link) {
			const { href } = link;
			get().setSaving(nodePath, true);

			const resp = await axios
				.post(href, { name, value })
				.catch((reason: AxiosError<ErrorResponse>) => {
					createApplicationRemoteError = reason?.response?.data || unknownError;
				});
			if (createApplicationRemoteError) {
				nodeUpdateState(set, nodePath, createApplicationRemoteError, []);
			} else if (resp && resp.status === 201) {
				const { err, children }: THierarchyChildDataResp =
					await getHierarchyChildData(data);

				nodeUpdateState(set, nodePath, err, children);
			} else {
				nodeUpdateState(set, nodePath, unknownError, []);
			}
		}
	},
	editApplication: async (
		data: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => {
		let editApplicationRemoteError: ErrorResponse | null = null;
		const link: Link | undefined = getSelfUpdateLink(data._links || [], false);

		if (link) {
			const { href } = link;
			get().setSaving(nodePath, true);

			const resp = await axios
				.put(href, { name, value })
				.catch((reason: AxiosError<ErrorResponse>) => {
					editApplicationRemoteError = reason.response?.data || unknownError;
				});

			if (editApplicationRemoteError) {
				nodeUpdateState(set, nodePath, editApplicationRemoteError, []);
			} else if (resp && resp.status === 200) {
				set((state: THierarchyState) => {
					const node = getNodeToUpdate(state.hierarchyData, nodePath);
					if (node) updateNodeValues(node, name, value);
				});
			} else {
				nodeUpdateState(set, nodePath, unknownError, []);
			}
		}
	},
});

/* eslint-disable import/prefer-default-export */
export const useHierarchyStore = createStore<THierarchyState>(HierarchyStore);
