/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useWhyDidYouUpdate } from 'use-hooks';
import { NodeActions, NodePath, TreeView } from '../../../types';
import { ErrorFallback } from './errorFallback';
import './hierarchy.css';
import { Node } from './node';
import { NodeEditor } from './nodeEditor';
import { TResponse, useTreeNode } from './useTreeNode';

interface HierarchyPropType extends NodeActions {
	data: TreeView[];
	expandNodesAtLevel?: number;
}

interface ApplicationPropType extends NodeActions {
	data: TreeView;
	index: number;
	nodeDepth: number;
	nodeId: number;
	nodePath: NodePath[];
	expandNodesAtLevel?: number;
}

interface TreeNodePropType extends NodeActions {
	data: TreeView;
	expandedByDefault: boolean;
	nodeId: number;
	nodePath: NodePath[];
	renderProps: () => React.ReactNode;
}

interface TreeNodeChildrenPropType extends NodeActions {
	childrenData: TreeView[] | undefined;
	nodeDepth: number;
	nodePath: NodePath[];
	expandNodesAtLevel: number | undefined;
}

interface NodeEditorPropType {
	onClose: () => void;
	onSubmit: (value: string) => void;
	defaultValue: string;
	data?: string;
}
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

const TreeNode: React.FC<TreeNodePropType> = (props): JSX.Element => {
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

	const {
		nodeState,
		toggleNode,
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
		onSelect,
		onAddApplication,
		onAddGroup,
		onEditApplication,
		onEditGroup,
		onToggle,
	});

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
						toggleChildren={nodeState.toggle}
						toggleNode={toggleNode}
						toggleNewEditor={toggleNewEditor}
						isLoadingChildren={nodeState.loadingChildren}
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

const TreeNodeChildren: React.FunctionComponent<TreeNodeChildrenPropType> = (
	props,
): JSX.Element => {
	const {
		childrenData,
		nodeDepth,
		nodePath,
		expandNodesAtLevel,
		onAddApplication,
		onAddGroup,
		onEditApplication,
		onEditGroup,
		onSelect,
		onToggle,
	} = props;
	return !childrenData || childrenData?.length === 0 ? (
		<></>
	) : (
		<ul className="w-full pl-5 ml-2 B">
			{childrenData.map((c, ci) => (
				<li
					key={`__li__${c.name}__`}
					className={`__li__${c.name}__ relative flex flex-col items-start justify-center h-auto list-none tree`}>
					<ul className="w-full">
						{
							// eslint-disable-next-line @typescript-eslint/no-use-before-define
							RenderNodesRecursively({
								data: c,
								nodeId: c.id,
								index: ci,
								nodeDepth: nodeDepth + 1,
								nodePath: [...nodePath, { pathId: c.id, pathName: c.name }],
								expandNodesAtLevel,
								onEditApplication,
								onEditGroup,
								onSelect,
								onToggle,
								onAddApplication,
								onAddGroup,
							})
						}
					</ul>
				</li>
			))}
		</ul>
	);
};

const TreeNodeIsSame = (
	prevProps: Readonly<React.PropsWithChildren<TreeNodePropType>>,
	nextProps: Readonly<React.PropsWithChildren<TreeNodePropType>>,
) =>
	prevProps.data.name === nextProps.data.name &&
	prevProps.data.value === nextProps.data.value &&
	prevProps.data?.childrenData === nextProps.data?.childrenData;

const TreeNodeMemo = React.memo(TreeNode, TreeNodeIsSame);

//  we can not have hooks inside RenderNodesrecursively bc we will get Rendered more hooks than during the previous render
// so have all ur hooks in treeNode.
const RenderNodesRecursively: React.FC<ApplicationPropType> = (
	props,
): JSX.Element => {
	const {
		data,
		index,
		nodeDepth,
		nodeId,
		nodePath,
		expandNodesAtLevel,
		children,
		onSelect,
		onEditApplication,
		onEditGroup,
		onToggle,
		onAddApplication,
		onAddGroup,
	} = props;

	return (
		<li
			key={nodeId}
			className="relative flex flex-col items-start justify-center h-auto list-none tree">
			<div className="w-full h-full">
				<TreeNodeMemo
					key={`treenode_${nodeId}_${nodePath.length}`}
					nodeId={nodeId}
					nodePath={nodePath}
					data={data}
					expandedByDefault={
						expandNodesAtLevel !== undefined
							? nodeDepth <= expandNodesAtLevel
							: false
					}
					onEditApplication={onEditApplication}
					onEditGroup={onEditGroup}
					onSelect={onSelect}
					onToggle={onToggle}
					onAddApplication={onAddApplication}
					onAddGroup={onAddGroup}
					renderProps={() => (
						<TreeNodeChildren
							key={`treenode_${nodeId}`}
							childrenData={data?.childrenData}
							nodePath={nodePath}
							nodeDepth={nodeDepth}
							expandNodesAtLevel={expandNodesAtLevel}
							onAddApplication={onAddApplication}
							onAddGroup={onAddGroup}
							onEditApplication={onEditApplication}
							onEditGroup={onEditGroup}
							onToggle={onToggle}
							onSelect={onSelect}
						/>
					)}
				/>
			</div>
			{children}
		</li>
	);
};

export const HierarchyTree: React.FC<HierarchyPropType> = (
	props,
): JSX.Element => {
	const {
		data,
		expandNodesAtLevel,
		onEditApplication,
		onEditGroup,
		onSelect,
		onToggle,
		onAddApplication,
		onAddGroup,
	} = props;

	useWhyDidYouUpdate('hierarchyTree', { ...props });

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<div className="w-full h-full text-white">
				<ul className="inset-y-0 left-0 z-10 h-full pl-5 ml-3 overflow-x-visible">
					{data.map((item, index) => (
						<RenderNodesRecursively
							key={`__node__${item.id}`}
							data={item}
							index={index}
							nodeDepth={0}
							nodeId={item.id}
							nodePath={[{ pathId: -1, pathName: item.name }]}
							expandNodesAtLevel={expandNodesAtLevel}
							onEditApplication={onEditApplication}
							onEditGroup={onEditGroup}
							onSelect={onSelect}
							onToggle={onToggle}
							onAddApplication={onAddApplication}
							onAddGroup={onAddGroup}
						/>
					))}
				</ul>
			</div>
		</ErrorBoundary>
	);
};
