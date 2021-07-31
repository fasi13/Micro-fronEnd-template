export interface Hierarchy {
	name: string;
}


export interface Link {
	href: string;
	method: { method: 'POST' | 'GET' | 'PUT' | 'DELETE' };
	name: string;
	rel: string;
}

export interface ApiResponse<T> {
	data: T;
	success: boolean;
}

export interface DataPaginated<T> {
	items: T[];
	limit: number;
	offset: number;
	totalCount: number;
	_links: Link[];
}

export interface Application {
	id: number | string;
	name: string;
	key?: string;
	value: string;
	_links: Link[];
}

export type TEditor = '' | 'Application' | 'Group';

export interface TreeView {
	id: number;
	key?: string;
	name: string;
	value?: string;
	collapsed: boolean;
	edit: boolean;
	saving: boolean;
	error: string | null;
	executedFetch?: boolean;
	isGroup?: boolean;
	childrenData?: TreeView[];
	toggleNewEditor: TEditor;
	nodeDepth: number;
	nodePath: NodePath[];
	parentId?: string | number;
	loadingChildren: boolean;
	selfLink?: Link;
	selfUpdateLink?: Link;
	createGroupLink?: Link;
	createApplicationLink?: Link;
	loadChildrenLink?: Link[];
	path?: Application;
	_links?: Link[];
}

export interface ApplicationResponse {
	_links: Link[];
	id: number;
	key: string;
	name: string;
	value: string;
	parentApplicationId: number | null;
	applicationGroupId: number | null;
	dateModified: string;
}

export interface ItreeData {
	name: string;
	key: number;
	children: ItreeData[];
	edit: boolean;
}
export interface ApplicationPath {
	path: Application[];
	_links: Link[];
}

export interface NodePath {
	pathName: string;
	pathId: number;
}

export interface ErrorResponse {
	title: string;
	status: number;
	errorCode: number;
	errors: string[];
}

export interface NodeActions {
	onToggleCollapse: (nodePath: NodePath[], val: boolean) => void;
	onToggleEdit: (nodePath: NodePath[], val: boolean) => void;
	onToggleNewEditor: (nodePath: NodePath[], val: TEditor) => void;
	onSetSaving: (nodePath: NodePath[], val: boolean) => void;
	onSetNodeErr: (
		nodePath: NodePath[],
		val: string | ErrorResponse | null,
	) => void;
	onAddApplication: (
		item: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => void;
	onEditApplication: (
		item: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => void;
	onAddGroup: (item: TreeView, nodePath: NodePath[], name: string) => void;
	onEditGroup: (item: TreeView, nodePath: NodePath[], name: string) => void;
}
