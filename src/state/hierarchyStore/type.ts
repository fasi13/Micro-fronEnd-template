import { ErrorResponse, NodePath, TEditor, TreeView } from '../../types';

export interface THierarchyState {
	defaultExpandLevel: number;
	loading: boolean;
	error: string | null;
	activeNodeId: number;
	hierarchyData: TreeView[];
	setLoading: (val: boolean) => void;
	setError: (err: string) => void; // ??
	loadApplication: () => void;
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
}

export interface THierarchyChildDataResp {
	err: ErrorResponse | null;
	children: TreeView[];
}
