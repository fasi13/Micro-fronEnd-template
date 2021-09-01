import {
	ErrorResponse,
	NodeActions,
	NodePath,
	TEditor,
	TreeView,
} from '../../../../types';

export interface TUseTreeNodeProps extends NodeActions {
	data: TreeView;
	nodePath: NodePath[];
}

interface TUseTreeNodeReturnType {
	canAddApplication: (node: TreeView) => boolean;
	showHideNewEditorAndTreeChildren: (
		isCollapsed: boolean,
		editorMode: string,
	) => '' | 'mb-10' | 'hidden';
	extractApplicationNameAndValue: (text: string) => string[];
	nodeValue: () => string;
	closeEditor: () => void;
	submitHandler: (value: string) => void;
	setErrorHandler: (err: string | ErrorResponse) => void;
	clearErrorHandler: () => void;
	isApplication: () => boolean;
	toggleEdit: () => void;
	toggleChildren: () => void;
	toggleNewEditor: (val: TEditor) => void;
	closeNewEditor: () => void;
}

export const useTreeNode = (
	props: TUseTreeNodeProps,
): TUseTreeNodeReturnType => {
	const {
		data,
		nodePath,
		onToggleEdit,
		onEditApplication,
		onAddApplication,
		onEditGroup,
		onAddGroup,
		onSetNodeErr,
		onToggleCollapse,
		onToggleNewEditor,
	} = props;

	const canAddApplication = (node: TreeView): boolean => {
		if (node._links?.find(l => l.rel === 'createApplication')) return true;
		return false;
	};

	const showHideNewEditorAndTreeChildren = (
		isCollapsed: boolean,
		editorMode: string,
	) => {
		if (!isCollapsed) {
			if (editorMode !== '') return 'mb-10';
			return '';
		}

		return 'hidden';
	};

	const nodeValue = (): string => {
		if (canAddApplication(data)) return data.name;
		return `${data.name} (${data.value?.toString().trimLeft()})`;
	};

	const extractApplicationNameAndValue = (text: string): string[] => {
		const newLocal = /^[^)(]+|\([^)(]*\)$/g;
		const result: string[] = text
			.match(new RegExp(newLocal))
			?.map(x => x.toString()) || ['', ''];
		if (result.length === 2) result[1] = result[1].replace(/[)(]+/g, '');
		if (result.length === 1) result.push(`${result[0]}`);

		return result;
	};

	const closeEditor = () => {
		onToggleEdit(nodePath, false);
	};

	const toggleEdit = () => onToggleEdit(nodePath, true);

	const toggleChildren = () => onToggleCollapse(nodePath, !data.collapsed);

	const toggleNewEditor = (val: TEditor) => onToggleNewEditor(nodePath, val);

	const closeNewEditor = () => onToggleNewEditor(nodePath, '');

	const submitHandler = (newValue: string) => {
		if (data.edit && canAddApplication(data)) {
			onEditGroup(data, nodePath, newValue);
		} else if (data.edit && !canAddApplication(data)) {
			const [name, value] = extractApplicationNameAndValue(newValue);
			onEditApplication(data, nodePath, name, value);
		} else if (data.toggleNewEditor === 'Application') {
			const [name, value] = extractApplicationNameAndValue(newValue);
			onAddApplication(data, nodePath, name, value);
		} else if (data.toggleNewEditor === 'Group') {
			onAddGroup(data, nodePath, newValue);
		} else;
	};

	const setErrorHandler = (err: string | ErrorResponse) => {
		onSetNodeErr(nodePath, err);
	};

	const clearErrorHandler = () => {
		onSetNodeErr(nodePath, null);
	};

	const isApplication = (): boolean => !canAddApplication(data);

	return {
		canAddApplication,
		showHideNewEditorAndTreeChildren,
		extractApplicationNameAndValue,
		nodeValue,
		closeEditor,
		submitHandler,
		setErrorHandler,
		clearErrorHandler,
		isApplication,
		toggleEdit,
		toggleChildren,
		toggleNewEditor,
		closeNewEditor,
	};
};
