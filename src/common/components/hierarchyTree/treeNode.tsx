import React from 'react';
import { useWhyDidYouUpdate } from 'use-hooks';
import { NodeActions, NodePath, TEditor, TreeView } from '../../../types';
import { Node } from './node';
import { NodeEditor } from './nodeEditor';

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

const nodeValue = (node: TreeView) => {
	if (canAddApplication(node)) return node.name;
	return `${node.name} (${node.value?.toString().trimLeft()})`;
};

export interface TreeNodePropType extends NodeActions {
	data: TreeView;
	nodeId: number;
	nodePath: NodePath[];
	renderProps: () => React.ReactNode;
}

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
	onEditApplication: (
		item: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => void,
	onAddApplication: (
		item: TreeView,
		nodePath: NodePath[],
		name: string,
		value: string,
	) => void,
	onEditGroup: (item: TreeView, nodePath: NodePath[], name: string) => void,
	onAddGroup: (item: TreeView, nodePath: NodePath[], name: string) => void,
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

export const TreeNode: React.FC<TreeNodePropType> = (props): JSX.Element => {
	const {
		nodeId,
		nodePath,
		data,
		onToggleCollapse,
		onEditApplication,
		onEditGroup,
		onAddApplication,
		onAddGroup,
		onSetNodeErr,
		onToggleEdit,
		onToggleNewEditor,
		renderProps,
	} = props;

	useWhyDidYouUpdate('TreeNode', { ...props });

	const submitHandler = (value: string) =>
		saveApplicationOrGroup(
			data,
			value,
			nodePath,
			onEditApplication,
			onAddApplication,
			onEditGroup,
			onAddGroup,
		);

	return (
		<>
			{/* a tree node in edit mode and normal node */}

			<div
				className={
					data.error && data.edit ? `h-10.5 w-full mb-10` : `h-10.5 w-full`
				}>
				{data.edit ? (
					<NodeEditor
						key={`node_editor_${nodeId}`}
						onClose={() => {
							onToggleEdit(nodePath, false);
						}}
						onSubmit={submitHandler}
						error={data.error}
						isSaving={data.saving}
						isApplication={!canAddApplication(data)}
						data={nodeValue(data)}
						setError={err => onSetNodeErr(nodePath, err)}
						clearError={() => onSetNodeErr(nodePath, null)}
					/>
				) : (
					<Node
						key={`node_${nodeId}`}
						data={data}
            nodePath={nodePath}
						editNode={() => onToggleEdit(nodePath, true)}
						toggleChildren={() => onToggleCollapse(nodePath, !data.collapsed)}
						toggleNewEditor={(val: TEditor) => onToggleNewEditor(nodePath, val)}
						isLoadingChildren={data.loadingChildren}
					/>
				)}
			</div>

			{/* toggle view of tree node with its children */}
			<div
				className={showHideNewEditorAndTreeChildren(
					data.collapsed,
					data.toggleNewEditor,
				)}>
				{data.toggleNewEditor !== '' ? (
					<ul className="w-full pl-5 ml-2" key={`editor_${nodeId}`}>
						<li className="relative flex flex-col items-start justify-center h-auto list-none tree">
							<NodeEditor
								key={`new_node_${nodeId}`}
								onClose={() => onToggleNewEditor(nodePath, '')}
								onSubmit={submitHandler}
								error={data.error}
								isSaving={data.saving}
								isApplication={data.toggleNewEditor === 'Application'}
								setError={err => onSetNodeErr(nodePath, err)}
								clearError={() => onSetNodeErr(nodePath, null)}
							/>
						</li>
					</ul>
				) : (
					<></>
				)}
				{renderProps()}
			</div>
		</>
	);
};

const TreeNodeIsSame = (
	prevProps: Readonly<React.PropsWithChildren<TreeNodePropType>>,
	nextProps: Readonly<React.PropsWithChildren<TreeNodePropType>>,
) =>
	prevProps.data.name === nextProps.data.name &&
	prevProps.data.value === nextProps.data.value &&
	prevProps.data?.childrenData === nextProps.data?.childrenData;

export const TreeNodeMemo = React.memo(TreeNode, TreeNodeIsSame);
