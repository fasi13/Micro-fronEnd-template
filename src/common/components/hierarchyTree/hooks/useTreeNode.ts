import { useCallback, useEffect, useReducer } from 'react';
import { useBreadcrumbStore } from '../../../../state';
import {
	ErrorResponse,
	NodeActions,
	NodePath,
	TreeView,
} from '../../../../types';
import { NodeRef } from '../node';

type TEditor = '' | 'Application' | 'Group';
type ActionType =
	| { type: 'TOGGLE_CHILDREN'; val: boolean }
	| { type: 'TOGGLE_CHILDREN_SUCCESS' }
	| { type: 'TOGGLE_CHILDREN_ERROR'; val: ErrorResponse }
	| { type: 'TOGGLE_NEW_EDITOR'; val: TEditor }
	| { type: 'TOGGLE_EDIT'; val: boolean }
	| { type: 'SAVE'; val: string }
	| { type: 'SAVING_SUCCESS' }
	| { type: 'SAVING_ERROR'; val: ErrorResponse }
	| { type: 'SAVE_RESET' }
	| { type: 'LOAD_CHILDREN'; val: boolean }
	| { type: 'SET_ERROR'; val: ErrorResponse | string }
	| { type: 'CLEAR_ERROR' }
	| { type: 'FORCE_TOGGLE_CHILDREN_APPLICATIONS' };

interface TNodeDetail extends NodeActions {
	data: TreeView;
	nodeId: number;
	nodePath: NodePath[];
	hasChildren: boolean;
	edit: boolean;
	toggle: boolean; // what is the point of this toggle ? how will this sink with the components state.
	saving: boolean;
	toggleNewEditor: TEditor;
	newValue: string | null;
	error: string | null;
	loadingChildren: boolean;
	isFetched: boolean;
	nodeType: 'Application' | 'Group';
	nodeRef: React.MutableRefObject<NodeRef | null>;
}

export interface TResponse {
	nodeState: TNodeDetail;
	toggleNewEditor: (val: TEditor) => void;
	editNode: (val: boolean) => void;
	save: (value: string) => void;
	setError: (val: ErrorResponse | string) => void;
	clearError: () => void;
}

const extractApplicationNameAndValue = (text: string): string[] => {
	const newLocal = /^[^)(]+|\([^)(]*\)$/g;
	return text.match(new RegExp(newLocal))?.map(x => x.toString()) || ['', ''];
};

const reducer = (prevState: TNodeDetail, action: ActionType): TNodeDetail => {
	switch (action.type) {
		case 'TOGGLE_CHILDREN': {
			if (
				action.val === true &&
				prevState.isFetched !== true &&
				!prevState.hasChildren
			)
				return {
					...prevState,
					toggle: action.val,
					loadingChildren: true,
					toggleNewEditor: '',
				};

			return { ...prevState, toggle: action.val, toggleNewEditor: '' };

			// return {
			// 	...prevState,
			// 	toggle: action.val,
			// 	toggleNewEditor: '',
			// 	loadingChildren: action.val,
			// };
		}
		case 'TOGGLE_CHILDREN_SUCCESS': {
			return { ...prevState, loadingChildren: false, isFetched: true };
		}
		case 'TOGGLE_CHILDREN_ERROR': {
			return {
				...prevState,
				loadingChildren: false,
				error: action.val.errors?.[0],
				isFetched: false,
			};
		}
		case 'TOGGLE_EDIT':
			return { ...prevState, edit: action.val, toggleNewEditor: '' };
		case 'TOGGLE_NEW_EDITOR': {
			if (action.val)
				return { ...prevState, toggleNewEditor: action.val, toggle: true };

			return {
				...prevState,
				toggleNewEditor: action.val,
				error: null,
				toggle: true,
			};
		}
		case 'SAVE': {
			return { ...prevState, newValue: action.val, saving: true, error: null };
		}
		case 'SAVING_SUCCESS':
			return {
				...prevState,
				saving: false,
				toggleNewEditor: '',
				loadingChildren: false,
				error: null,
				isFetched: false,
			};
		case 'SAVING_ERROR':
			return { ...prevState, saving: false, error: action.val.errors?.[0] };
		case 'SAVE_RESET':
			return {
				...prevState,
				saving: false,
				toggleNewEditor: '',
				loadingChildren: false,
				error: null,
			};
		case 'LOAD_CHILDREN':
			return { ...prevState, loadingChildren: action.val };
		case 'SET_ERROR': {
			if (typeof action.val === 'string')
				return { ...prevState, error: action.val };
			return { ...prevState, error: action.val.errors?.[0] };
		}
		case 'CLEAR_ERROR':
			return { ...prevState, error: null };
		default:
			throw new Error();
	}
};

export const useTreeNode = (nodeDetail: TNodeDetail): TResponse => {
	const [nodeState, dispatch] = useReducer(reducer, nodeDetail);
	const { setBreadCrumb } = useBreadcrumbStore();
	const { nodeRef } = nodeDetail;

	const toggleNewEditor = useCallback((val: TEditor) => {
		dispatch({ type: 'TOGGLE_NEW_EDITOR', val });
	}, []);

	const toggleNodeRef = () => {
		if (nodeRef.current) {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			nodeRef.current.toggleChild(nodeState.toggle, toggleNode);
		}
	};
	const savingCb = useCallback((err: ErrorResponse | null) => {
		if (err) {
			dispatch({ type: 'SAVING_ERROR', val: err });
		} else if (nodeState.edit === false) {
			// refetch
			dispatch({ type: 'SAVING_SUCCESS' });
			toggleNodeRef();
			// loadNodeChildren();
		}
	}, []);

	const editNode = useCallback((val: boolean) => {
		dispatch({ type: 'TOGGLE_EDIT', val });
	}, []);

	const save = useCallback((value: string) => {
		dispatch({ type: 'SAVE', val: value });
	}, []);

	const toggleNode = useCallback((val: boolean) => {
		dispatch({ type: 'TOGGLE_CHILDREN', val });
	}, []);

	const setError = useCallback((val: ErrorResponse | string) => {
		dispatch({ type: 'SET_ERROR', val });
	}, []);

	const clearError = useCallback(() => {
		dispatch({ type: 'CLEAR_ERROR' });
	}, []);

	const loadNodeChildren = useCallback(() => {
		const { data, nodeId, nodePath, onToggle } = nodeDetail;

		onToggle(data, nodeId, nodePath, (err: ErrorResponse | null) => {
			if (err) dispatch({ type: 'TOGGLE_CHILDREN_ERROR', val: err });
			else {
				dispatch({ type: 'TOGGLE_CHILDREN_SUCCESS' });
				setBreadCrumb(nodePath);
			}
		});
	}, [nodeState.loadingChildren]);

	const editApplication = useCallback(
		(name: string, value: string) => {
			if (nodeState.saving) {
				const { data, nodeId, nodePath, onEditApplication } = nodeDetail;
				onEditApplication(
					data,
					nodeId,
					nodePath,
					name,
					value.replaceAll(/\(|\)/gi, ''),
					savingCb,
				);
			}
		},
		[nodeState.saving],
	);

	const editGroup = useCallback(
		(name: string) => {
			if (nodeState.saving) {
				const { data, nodeId, nodePath, onEditGroup } = nodeDetail;
				onEditGroup(data, nodeId, nodePath, name, savingCb);
			}
		},
		[nodeState.saving],
	);

	const addApplication = useCallback(
		(name: string, value: string) => {
			if (nodeState.saving) {
				const { data, nodeId, nodePath, onAddApplication } = nodeDetail;
				onAddApplication(
					data,
					nodeId,
					nodePath,
					name,
					value.replaceAll(/\(|\)/gi, ''),
					savingCb,
				);
			}
		},
		[nodeState.saving],
	);

	const addGroup = useCallback(
		(name: string) => {
			if (nodeState.saving) {
				const { data, nodeId, nodePath, onAddGroup } = nodeDetail;
				onAddGroup(data, nodeId, nodePath, name, savingCb);
			}
		},
		[nodeState.saving],
	);

	useEffect(() => {
		if (nodeState.saving) {
			const { newValue } = nodeState;
			if (nodeState.edit) {
				if (nodeState.nodeType === 'Application' && newValue) {
					const [name, value] = extractApplicationNameAndValue(newValue);
					editApplication(name, value);
				} else if (nodeState.nodeType === 'Group' && newValue) {
					editGroup(newValue);
				}
			} else if (nodeState.toggleNewEditor === 'Application' && newValue) {
				const [name, value] = extractApplicationNameAndValue(newValue);
				addApplication(name, value);
			} else if (nodeState.toggleNewEditor === 'Group' && newValue) {
				addGroup(newValue);
			}
		}
	}, [nodeState.saving]);

	useEffect(() => {
		if (nodeState.loadingChildren) loadNodeChildren();
	}, [nodeState.loadingChildren]);

	useEffect(() => {
		if (!nodeState.edit) dispatch({ type: 'CLEAR_ERROR' });
	}, [nodeState.edit]);

	useEffect(() => {
		if (nodeDetail.toggle) dispatch({ type: 'LOAD_CHILDREN', val: true });
	}, []);

	return {
		nodeState,
		toggleNewEditor,
		editNode,
		save,
		setError,
		clearError,
	};
};
