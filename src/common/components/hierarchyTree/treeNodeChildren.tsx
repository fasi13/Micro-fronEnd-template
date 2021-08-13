import React from 'react';
import { NodeActions, NodePath, TreeView } from '../../../types';
import { RenderNodesRecursively } from './renderNodesRecursively';

export interface TreeNodeChildrenPropType extends NodeActions {
	childrenData: TreeView[] | undefined;
	nodeDepth: number;
	nodePath: NodePath[];
	expandNodesAtLevel: number | undefined;
}

export const TreeNodeChildren: React.FunctionComponent<TreeNodeChildrenPropType> =
	(props): JSX.Element => {
		const {
			childrenData,
			nodeDepth,
			nodePath,
			expandNodesAtLevel,
			onAddApplication,
			onAddGroup,
			onEditApplication,
			onEditGroup,
			onToggleCollapse,
			onSetNodeErr,
			onSetSaving,
			onToggleEdit,
			onToggleNewEditor,
		} = props;
		return !childrenData || childrenData?.length === 0 ? (
			<></>
		) : (
			<ul className="w-full pl-5 ml-2 B">
				{}
				{childrenData.map(c => (
					<li
						key={`__li__${c.name}__`}
						className={`__li__${c.name}__ relative flex flex-col items-start justify-center h-auto list-none tree`}>
						<ul className="w-full">
							{RenderNodesRecursively({
								data: c,
								nodeId: c.id,
								nodeDepth: nodeDepth + 1,
								nodePath: [...nodePath, { pathId: c.id, pathName: c.name }],
								expandNodesAtLevel,
								onEditApplication,
								onEditGroup,
								onToggleCollapse,
								onAddApplication,
								onSetNodeErr,
								onSetSaving,
								onToggleEdit,
								onAddGroup,
								onToggleNewEditor,
							})}
						</ul>
					</li>
				))}
			</ul>
		);
	};
