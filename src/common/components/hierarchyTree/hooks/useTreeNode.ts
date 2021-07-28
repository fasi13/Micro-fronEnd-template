// import { useCallback, useEffect, useReducer } from 'react';
// import { useBreadcrumbStore, useHierarchyStore } from '../../../../state';
// import {
// 	ErrorResponse,
// 	NodeActions,
// 	NodePath,
// 	TreeView,
// } from '../../../../types';

// type TEditor = '' | 'Application' | 'Group';
// type ActionType =
// 	| { type: 'LOAD_CHILDREN' }
// 	| { type: 'LOAD_CHILDREN_SUCCESS' }
// 	| { type: 'LOAD_CHILDREN_ERROR'; val: ErrorResponse }
// 	| { type: 'TOGGLE_NEW_EDITOR'; val: TEditor }
// 	| { type: 'TOGGLE_EDIT'; val: boolean }
// 	| { type: 'SAVE'; val: string }
// 	| { type: 'SAVING_SUCCESS' }
// 	| { type: 'SAVING_ERROR'; val: ErrorResponse }
// 	| { type: 'SAVE_RESET' }
// 	| { type: 'SET_ERROR'; val: ErrorResponse | string }
// 	| { type: 'CLEAR_ERROR' }
// 	| { type: 'COLLAPSE_CHILDREN_NODES' };

// interface TNodeDetail extends NodeActions {
// 	data: TreeView;
// 	nodeId: number;
// 	nodePath: NodePath[];
// 	edit: boolean | null;
// 	saving: boolean;
// 	toggleNewEditor: TEditor;
// 	newValue: string | null;
// 	error: string | null;
// 	loadingChildren: boolean;
// 	isFetched: boolean;
// 	nodeType: 'Application' | 'Group';
// }
// export interface TResponse {
// 	nodeState: TNodeDetail;
// 	toggleNewEditor: (val: TEditor) => void;
// 	editNode: (val: boolean) => void;
// 	toggleChildren: () => void;
// 	save: (value: string) => void;
// 	setError: (val: ErrorResponse | string) => void;
// 	clearError: () => void;
// }

// const extractApplicationNameAndValue = (text: string): string[] => {
// 	const newLocal = /^[^)(]+|\([^)(]*\)$/g;
// 	return text.match(new RegExp(newLocal))?.map(x => x.toString()) || ['', ''];
// };

// const reducer = (prevState: TNodeDetail, action: ActionType): TNodeDetail => {
// 	switch (action.type) {
// 		case 'LOAD_CHILDREN': {
// 			return {
// 				...prevState,
// 				loadingChildren: true,
// 				toggleNewEditor: '',
// 			};
// 		}
// 		case 'LOAD_CHILDREN_SUCCESS': {
// 			return { ...prevState, loadingChildren: false, isFetched: true };
// 		}
// 		case 'LOAD_CHILDREN_ERROR': {
// 			return {
// 				...prevState,
// 				loadingChildren: false,
// 				error: action.val.errors?.[0],
// 				isFetched: false,
// 			};
// 		}
// 		case 'TOGGLE_EDIT':
// 			return { ...prevState, edit: action.val, toggleNewEditor: '' };
// 		case 'TOGGLE_NEW_EDITOR': {
// 			if (action.val) return { ...prevState, toggleNewEditor: action.val };

// 			return {
// 				...prevState,
// 				toggleNewEditor: action.val,
// 				error: null,
// 			};
// 		}
// 		case 'SAVE': {
// 			return { ...prevState, newValue: action.val, saving: true, error: null };
// 		}
// 		case 'SAVING_SUCCESS':
// 			return {
// 				...prevState,
// 				saving: false,
// 				toggleNewEditor: '',
// 				loadingChildren: false,
// 				error: null,
// 				isFetched: false,
// 			};
// 		case 'SAVING_ERROR':
// 			return { ...prevState, saving: false, error: action.val.errors?.[0] };
// 		case 'SAVE_RESET':
// 			return {
// 				...prevState,
// 				saving: false,
// 				toggleNewEditor: '',
// 				loadingChildren: false,
// 				error: null,
// 			};
// 		case 'SET_ERROR': {
// 			if (typeof action.val === 'string')
// 				return { ...prevState, error: action.val };
// 			return { ...prevState, error: action.val.errors?.[0] };
// 		}
// 		case 'CLEAR_ERROR':
// 			return { ...prevState, error: null };
// 		default:
// 			throw new Error();
// 	}
// };

// export const useTreeNode = (nodeDetail: TNodeDetail): TResponse => {
// 	const [nodeState, dispatch] = useReducer(reducer, nodeDetail);
// 	const { setBreadCrumb } = useBreadcrumbStore();

// 	const toggleNewEditor = useCallback((val: TEditor) => {
// 		dispatch({ type: 'TOGGLE_NEW_EDITOR', val });
// 	}, []);

// 	const editNode = useCallback((val: boolean) => {
// 		dispatch({ type: 'TOGGLE_EDIT', val });
// 	}, []);

// 	const save = useCallback((value: string) => {
// 		dispatch({ type: 'SAVE', val: value });
// 	}, []);

// 	const setError = useCallback((val: ErrorResponse | string) => {
// 		dispatch({ type: 'SET_ERROR', val });
// 	}, []);

// 	const clearError = useCallback(() => {
// 		dispatch({ type: 'CLEAR_ERROR' });
// 	}, []);

// 	const savingCb = useCallback((err: ErrorResponse | null) => {
// 		if (err) {
// 			dispatch({ type: 'SAVING_ERROR', val: err });
// 		} else if (nodeState.edit === false) {
// 			// refetch
// 			dispatch({ type: 'SAVING_SUCCESS' });
// 			// call  state method to collapse children
// 			// store.collapseChildren(node);
// 		}
// 	}, []);

// 	const loadNodeChildren = useCallback(() => {
// 		const { data, nodeId, nodePath, getChildren, onToggleCollapse } =
// 			nodeDetail;

// 		getChildren(data, nodeId, nodePath, (err: ErrorResponse | null) => {
// 			if (err) dispatch({ type: 'LOAD_CHILDREN_ERROR', val: err });
// 			else {
// 				dispatch({ type: 'LOAD_CHILDREN_SUCCESS' });
// 				onToggleCollapse(nodePath, false);
// 				setBreadCrumb(nodePath);
// 			}
// 		});
// 	}, [nodeState.loadingChildren]);

// 	const editApplication = useCallback(
// 		(name: string, value: string) => {
// 			if (nodeState.saving) {
// 				const { data, nodeId, nodePath, onEditApplication } = nodeDetail;
// 				onEditApplication(
// 					data,
// 					nodeId,
// 					nodePath,
// 					name,
// 					value.replaceAll(/\(|\)/gi, ''),
// 					savingCb,
// 				);
// 			}
// 		},
// 		[nodeState.saving],
// 	);

// 	const editGroup = useCallback(
// 		(name: string) => {
// 			if (nodeState.saving) {
// 				const { data, nodeId, nodePath, onEditGroup } = nodeDetail;
// 				onEditGroup(data, nodeId, nodePath, name, savingCb);
// 			}
// 		},
// 		[nodeState.saving],
// 	);

// 	const addApplication = useCallback(
// 		(name: string, value: string) => {
// 			if (nodeState.saving) {
// 				const { data, nodeId, nodePath, onAddApplication } = nodeDetail;
// 				onAddApplication(
// 					data,
// 					nodeId,
// 					nodePath,
// 					name,
// 					value.replaceAll(/\(|\)/gi, ''),
// 					savingCb,
// 				);
// 			}
// 		},
// 		[nodeState.saving],
// 	);

// 	const addGroup = useCallback(
// 		(name: string) => {
// 			if (nodeState.saving) {
// 				const { data, nodeId, nodePath, onAddGroup } = nodeDetail;
// 				onAddGroup(data, nodeId, nodePath, name, savingCb);
// 			}
// 		},
// 		[nodeState.saving],
// 	);

// 	const toggleChildren = useCallback(() => {
// 		const { data, nodePath, onToggleCollapse } = nodeDetail;

// 		if (data.collapsed && !nodeState.isFetched && !data.childrenData)
// 			dispatch({ type: 'LOAD_CHILDREN' });
// 		else if (data.collapsed && nodeState.isFetched && data.childrenData)
// 			onToggleCollapse(nodePath, false);
// 		else if (!data.collapsed) {
// 			// just collapse
// 			onToggleCollapse(nodePath, true);
// 		}
// 	}, [nodeDetail]);

// 	useEffect(() => {
// 		if (nodeState.saving) {
// 			const { newValue } = nodeState;
// 			if (nodeState.edit) {
// 				if (nodeState.nodeType === 'Application' && newValue) {
// 					const [name, value] = extractApplicationNameAndValue(newValue);
// 					editApplication(name, value);
// 				} else if (nodeState.nodeType === 'Group' && newValue) {
// 					editGroup(newValue);
// 				}
// 			} else if (nodeState.toggleNewEditor === 'Application' && newValue) {
// 				const [name, value] = extractApplicationNameAndValue(newValue);
// 				addApplication(name, value);
// 			} else if (nodeState.toggleNewEditor === 'Group' && newValue) {
// 				addGroup(newValue);
// 			}
// 		}
// 	}, [nodeState.saving]);

// 	useEffect(() => {
// 		if (nodeState.loadingChildren) loadNodeChildren();
// 	}, [nodeState.loadingChildren]);

// 	useEffect(() => {
// 		if (!nodeState.edit) dispatch({ type: 'CLEAR_ERROR' });
// 	}, [nodeState.edit]);

// 	useEffect(() => {
// 		console.log('???? -->', nodeDetail.data);
// 	}, []);

// 	return {
// 		nodeState,
// 		toggleNewEditor,
// 		toggleChildren,
// 		editNode,
// 		save,
// 		setError,
// 		clearError,
// 	};
// };


export { };
