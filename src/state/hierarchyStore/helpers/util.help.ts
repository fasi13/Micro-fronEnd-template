import { ErrorResponse, NodePath, TreeView } from '../../../types';
import { HierarchyClient as axios } from '../../../util/axios';
import { THierarchyChildDataResp } from '../type';
import * as linkHelper from './hierarchy.link.helper';

export const nodeErrorHandler = (err: ErrorResponse, data: TreeView): void => {
	data.loadingChildren = false;
	data.error = err.errors?.[0];
	data.saving = false;
};

export const updateChildrenHandler = (
	data: TreeView,
	children: TreeView[],
): void => {
	data.childrenData = [...children];
	data.loadingChildren = false;
	data.collapsed = false;
	data.toggleNewEditor = '';
	data.saving = false;
};

// modify this to include undefined and start from 0
export const getNodeToUpdate = (
	hierarchyData: TreeView[],
	nodePath: NodePath[],
): TreeView | undefined => {
	let node: TreeView | undefined = hierarchyData[0]; // starting from the parent i.e. hierarchyData[0]
	for (let i = 0; i < nodePath.length; i += 1) {
		const nodeToUpdate: TreeView | undefined = node?.childrenData?.find(
			pn => pn.id === nodePath[i].pathId,
		);
		node = nodeToUpdate || undefined;
	}
	return node;
};

export const getHierarchyChildData = async (
	data: TreeView,
): Promise<THierarchyChildDataResp> => {
	let err: ErrorResponse | null = null;
	let childrenData: TreeView[] = [];

	if (data._links) {
		const links = linkHelper.getChildrenLink(data._links);
		if (links) {
			const resp = await Promise.all(
				links.map(async link => {
					const { href } = link;
					return axios.get(href);
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
			return Promise.resolve({ err, children: childrenData });
		}
	}
	err = {
		errorCode: 0,
		errors: ['Could not find the link to load children with'],
		status: 0,
		title: 'unknown error',
	};

	return Promise.resolve({ err, children: childrenData });
};

export const updateNodeValues = (
	node: TreeView,
	name: string,
	value: string,
): void => {
	node.name = name;
	node.value = value;
	node.saving = false;
	node.toggleNewEditor = '';
	node.loadingChildren = false;
	node.edit = false;
	node.error = null;
};
