import {
	ErrorResponse,
	NodeActions,
	NodePath,
	TEditor,
	TreeView,
} from '../../../../types';

interface useTreeNodeProps extends NodeActions {
	data: TreeView;
	nodeId: number;
	nodePath: NodePath[];
}

export const useTreeNode = (props: useTreeNodeProps) => {
	const {
		data,
		nodeId,
		nodePath,
		onToggleEdit,
		onEditApplication,
		onAddApplication,
		onEditGroup,
		onAddGroup,
		onSetNodeErr,
		onSetSaving,
		onToggleCollapse,
		onToggleNewEditor,
	} = props;

	console.log(nodeId, onSetSaving);

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
		if (result.length === 2)
			result[1] = result[1] ? result[1].replace(/[)(]+/g, '') : result[1];

		return result;
	};

	const saveApplicationOrGroup = (
		dataToSave: TreeView,
		newValue: string,
		path: NodePath[],
	) => {
		if (dataToSave.edit && canAddApplication(dataToSave)) {
			onEditGroup(dataToSave, path, newValue);
		} else if (dataToSave.edit && !canAddApplication(dataToSave)) {
			const [name, value] = extractApplicationNameAndValue(newValue);
			onEditApplication(dataToSave, path, name, value);
		} else if (dataToSave.toggleNewEditor === 'Application') {
			const [name, value] = extractApplicationNameAndValue(newValue);
			onAddApplication(dataToSave, path, name, value);
		} else if (dataToSave.toggleNewEditor === 'Group') {
			onAddGroup(dataToSave, path, newValue);
		}
	};

	const closeEditor = () => {
		onToggleEdit(nodePath, false);
	};

	const toggleEdit = () => onToggleEdit(nodePath, true);

	const toggleChildren = () => onToggleCollapse(nodePath, !data.collapsed);

	const toggleNewEditor = (val: TEditor) => onToggleNewEditor(nodePath, val);

	const submitHandler = (value: string) => {
		saveApplicationOrGroup(data, value, nodePath);
	};

	const setErrorHandler = (err: string | ErrorResponse) => {
		onSetNodeErr(nodePath, err);
	};

	const clearErrorHandle = () => {
		onSetNodeErr(nodePath, null);
	};

	const isApplication = (): boolean => !canAddApplication(data);

	return {
		canAddApplication,
		showHideNewEditorAndTreeChildren,
		nodeValue,
		saveApplicationOrGroup,
		closeEditor,
		submitHandler,
		setErrorHandler,
		clearErrorHandle,
		isApplication,
		toggleEdit,
		toggleChildren,
		toggleNewEditor,
	};
};
