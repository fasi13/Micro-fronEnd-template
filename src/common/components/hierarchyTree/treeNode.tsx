import React, { useEffect, useRef } from 'react';
import { useWhyDidYouUpdate } from 'use-hooks';
import { NodeActions, NodePath, TreeView } from '../../../types';
import { TResponse, useTreeNode } from './hooks/useTreeNode';
import { Node, NodeRef } from './node';
import { NodeEditor } from './nodeEditor';

const canAddApplication = (node: TreeView): boolean => {
	if (node._links?.find(l => l.rel === 'createApplication')) return true;
	return false;
};

const showHideNewEditor = (isToggled: boolean, editorMode: string) => {
	if (isToggled) {
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
	expandedByDefault: boolean;
	nodeId: number;
	nodePath: NodePath[];
	renderProps: () => React.ReactNode;
}

export const TreeNode: React.FC<TreeNodePropType> = (props): JSX.Element => {
	const {
		nodeId,
		nodePath,
		data,
		expandedByDefault,
		onToggle,
		onEditApplication,
		onEditGroup,
		onSelect,
		onAddApplication,
		onAddGroup,
		renderProps,
	} = props;
	useWhyDidYouUpdate('TreeNode', { ...props });

	const nodeRef: React.MutableRefObject<NodeRef | null> = useRef<NodeRef>(null);

	const {
		nodeState,
		toggleNewEditor,
		editNode,
		save,
		setError,
		clearError,
	}: TResponse = useTreeNode({
		data,
		nodeId,
		nodePath,
		hasChildren: false,
		edit: false,
		toggle: expandedByDefault,
		saving: false,
		toggleNewEditor: '',
		newValue: null,
		error: null,
		loadingChildren: false,
		isFetched: false,
		nodeType: !canAddApplication(data) ? 'Application' : 'Group',
		nodeRef,
		onSelect,
		onAddApplication,
		onAddGroup,
		onEditApplication,
		onEditGroup,
		onToggle,
	});

	function toggleNodeRef() {
		if (nodeRef.current) {
			nodeRef.current.toggleChild(expandedByDefault, () => {
				console.log('default toggle');
			});
		}
	}

	useEffect(() => {
		// console.log(toggleNode);
		if (expandedByDefault) {
			toggleNodeRef();
		}
	}, []);

	return (
		<>
			{/* a tree node in edit mode and normal node */}

			<div
				className={
					nodeState.error && nodeState.edit
						? `h-10.5 w-full mb-10`
						: `h-10.5 w-full`
				}>
				{nodeState.edit ? (
					<NodeEditor
						key={`node_editor_${nodeId}`}
						onClose={() => {
							editNode(false);
						}}
						onSubmit={value => save(value)}
						error={nodeState.error}
						isSaving={nodeState.saving}
						isApplication={!canAddApplication(data)}
						data={nodeValue(nodeState.data)}
						setError={setError}
						clearError={clearError}
					/>
				) : (
					<Node
						key={`node_${nodeId}`}
						data={nodeState.data}
						editNode={editNode}
						toggleNewEditor={toggleNewEditor}
						isLoadingChildren={nodeState.loadingChildren}
						ref={nodeRef || undefined}
					/>
				)}
			</div>

			{/* toggle view of tree node with its children */}
			<div
				className={showHideNewEditor(
					nodeState.toggle,
					nodeState.toggleNewEditor,
				)}>
				{nodeState.toggleNewEditor !== '' ? (
					<ul className="w-full pl-5 ml-2" key={`editor_${nodeId}`}>
						<li className="relative flex flex-col items-start justify-center h-auto list-none tree">
							<NodeEditor
								key={`new_node_${nodeId}`}
								onClose={() => toggleNewEditor('')}
								onSubmit={value => save(value)}
								error={nodeState.error}
								isSaving={nodeState.saving}
								isApplication={nodeState.toggleNewEditor === 'Application'}
								setError={setError}
								clearError={clearError}
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
