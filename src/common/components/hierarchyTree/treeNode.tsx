/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { NodeActions, NodePath, TreeView } from '../../../types';
import { useTreeNode } from './hooks/useTreeNode';
import { Node } from './node';
import { NodeEditor } from './nodeEditor';

export interface TreeNodePropType extends NodeActions {
	data: TreeView;
	nodeId: number;
	nodePath: NodePath[];
	renderProps: () => React.ReactNode;
}

export const TreeNode: React.FC<TreeNodePropType> = (props): JSX.Element => {
	const { nodeId, nodePath, data, renderProps } = props;

	const {
		showHideNewEditorAndTreeChildren,
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
	} = useTreeNode(props);

	return (
		<>
			{/* a tree node in edit mode and normal node */}

			<div
				data-testid="treeitem"
				className={
					data.error && data.edit ? `h-10.5 w-full mb-10` : `h-10.5 w-full`
				}>
				{data.edit ? (
					<NodeEditor
						key={`node_editor_${nodeId}`}
						onClose={closeEditor}
						onSubmit={submitHandler}
						error={data.error}
						isSaving={data.saving}
						isApplication={isApplication()}
						data={nodeValue()}
						setError={setErrorHandler}
						clearError={clearErrorHandler}
					/>
				) : (
					<Node
						key={`node_${nodeId}`}
						data={data}
						nodePath={nodePath}
						editNode={toggleEdit}
						toggleChildren={toggleChildren}
						toggleNewEditor={toggleNewEditor}
						isLoadingChildren={data.loadingChildren}
					/>
				)}
			</div>

			{/* toggle view of tree node with its children */}
			<div
				data-testid="tree-item-children"
				className={showHideNewEditorAndTreeChildren(
					data.collapsed,
					data.toggleNewEditor,
				)}>
				{data.toggleNewEditor !== '' ? (
					<ul
						data-testid="new-node-editor"
						className="w-full pl-5 ml-2"
						key={`editor_${nodeId}`}>
						<li className="relative flex flex-col items-start justify-center h-auto list-none tree">
							<NodeEditor
								key={`new_node_${nodeId}`}
								onClose={closeNewEditor}
								onSubmit={submitHandler}
								error={data.error}
								isSaving={data.saving}
								isApplication={data.toggleNewEditor === 'Application'}
								setError={setErrorHandler}
								clearError={clearErrorHandler}
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

// const TreeNodeIsSame = (
// 	prevProps: Readonly<React.PropsWithChildren<TreeNodePropType>>,
// 	nextProps: Readonly<React.PropsWithChildren<TreeNodePropType>>,
// ) =>
// 	prevProps.data.name === nextProps.data.name &&
// 	prevProps.data.value === nextProps.data.value &&
// 	prevProps.data?.childrenData === nextProps.data?.childrenData;

// export const TreeNodeMemo = React.memo(TreeNode, TreeNodeIsSame);
