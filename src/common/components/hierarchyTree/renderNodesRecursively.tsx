import React from 'react';
import { NodeActions, NodePath, TreeView } from '../../../types';
import { TreeNode } from './treeNode';
import { TreeNodeChildren } from './treeNodeChildren';

export interface ApplicationPropType extends NodeActions {
	data: TreeView;
	nodeDepth: number;
	nodeId: number;
	nodePath: NodePath[];
	expandNodesAtLevel?: number;
}
//  we can not have hooks inside RenderNodesrecursively bc we will get Rendered more hooks than during the previous render
// so have all ur hooks in treeNode.
export const RenderNodesRecursively: React.FC<ApplicationPropType> = (
	props,
): JSX.Element => {
	const {
		data,
		nodeDepth,
		nodeId,
		nodePath,
		expandNodesAtLevel,
		children,
		onEditApplication,
		onEditGroup,
		onToggleCollapse,
		onAddApplication,
		onAddGroup,
		onSetNodeErr,
		onSetSaving,
		onToggleEdit,
		onToggleNewEditor,
	} = props;

	return (
		<li
			key={nodeId}
			className="relative flex flex-col items-start justify-center h-auto pl-2 list-none tree">
			<div className="w-full h-full">
				<TreeNode
					key={`treenode_${nodeId}_${nodePath.length}`}
					nodeId={nodeId}
					nodePath={nodePath}
					data={data}
					onEditApplication={onEditApplication}
					onEditGroup={onEditGroup}
					onToggleCollapse={onToggleCollapse}
					onAddApplication={onAddApplication}
					onAddGroup={onAddGroup}
					onSetNodeErr={onSetNodeErr}
					onSetSaving={onSetSaving}
					onToggleEdit={onToggleEdit}
					onToggleNewEditor={onToggleNewEditor}
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
							onToggleCollapse={onToggleCollapse}
							onSetNodeErr={onSetNodeErr}
							onSetSaving={onSetSaving}
							onToggleEdit={onToggleEdit}
							onToggleNewEditor={onToggleNewEditor}
						/>
					)}
				/>
			</div>
			{children}
		</li>
	);
};
