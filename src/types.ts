export interface Hierarchy {
	name: string;
}

export interface MfeOption {
	description: string;
	logo: string;
	order: number;
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
export interface TreeView {
	id: string | number;
	key?: string;
	name: string;
	value?: string;
	collapsed?: boolean;
	executedFetch?: boolean;
	isGroup?: boolean;
	childrenData?: TreeView[];
	parentId?: string | number;
	loading?: boolean;
	selfLink?: Link;
	selfUpdateLink?: Link;
	createGroupLink?: Link;
	createApplicationLink?: Link;
	loadChildrenLink?: Link[];
	path?: Application; // ??
	_links?: Link[];
	edit: boolean;
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

export interface Wee {
	name: string;
}

export interface ItreeData {
	name: string;
	key: number;
	children: ItreeData[];
	edit: boolean;
}

// export interface ApplicationGroupResponse {
// 	_links: Link[];
// 	id: number;
// 	key: string;
// 	name: string;
// 	value: string;
// 	parentApplicationId: number | null;
// 	applicationGroupId: number | null;
// 	dateModified: string;
// }

// export interface IApplication {}
// export interface Group {}

// export interface Node {}
