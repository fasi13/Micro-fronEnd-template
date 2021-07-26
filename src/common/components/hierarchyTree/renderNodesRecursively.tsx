import React from 'react';
import { NodeActions, NodePath, TreeView } from '../../../types';
import { TreeNode } from './treeNode';
import { TreeNodeChildren } from './treeNodeChildren';

interface ApplicationPropType extends NodeActions {
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
				<TreeNode
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
					renderProps={(collapseChildren: boolean) => (
						<TreeNodeChildren
							key={`treenode_${nodeId}`}
							childrenData={data?.childrenData}
							nodePath={nodePath}
							nodeDepth={nodeDepth}
							expandNodesAtLevel={collapseChildren ? -1 : expandNodesAtLevel}
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
