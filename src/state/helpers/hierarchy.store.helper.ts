import { ErrorResponse, Link, NodePath, TEditor, TreeView } from '../../types';
import { HierarchyClient as axios } from '../../util/axios';

export interface HierarchyState {
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

export interface THierarchyChildDataResp {
	err: ErrorResponse | null;
	children: TreeView[];
}

export const getSelfUpdateLink = (
	links: Link[],
	isGroup: boolean,
): Link | undefined =>
	isGroup
		? links.find(l => l.rel === 'updateApplicationGroup')
		: links.find(l => l.rel === 'updateApplication');

export const getCreateGroupLink = (links: Link[]): Link | undefined =>
	links.find(l => l.rel === 'createApplicationGroup');

export const getCreateApplicationLink = (links: Link[]): Link | undefined =>
	links.find(l => l.rel === 'createApplication');

export const getChildrenLink = (links: Link[]): Link[] | undefined =>
	links.filter(l => l.rel === 'applications' || l.rel === 'applicationGroups');

export const getNodeToUpdate = (
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

export const getHierarchyChildData = async (
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

export const updateNodeValues = (
	node: TreeView,
	name: string,
	value: string,
): void => {
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

export const nodeUpdateState = (
	set: any,
	nodePath: NodePath[],
	err: ErrorResponse | null,
	children: TreeView[],
): void => {
	set((state: HierarchyState) => {
		const node = getNodeToUpdate(state.hierarchyData, nodePath);

		if (err) {
			nodeErrorHandler(err, node);
		} else {
			updateChildrenHandler(node, children);
			// set breadcrumb here
		}
	});
};
