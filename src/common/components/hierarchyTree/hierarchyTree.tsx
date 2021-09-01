/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { NodeActions, TreeView } from '../../../types';
import { ErrorFallback } from './errorFallback';
import './hierarchy.css';
import { RenderNodesRecursively } from './renderNodesRecursively';

export interface HierarchyPropType extends NodeActions {
	data: TreeView[];
	expandNodesAtLevel?: number;
}

export const HierarchyTree: React.FC<HierarchyPropType> = (
	props,
): JSX.Element => {
	const {
		data,
		expandNodesAtLevel,
		onEditApplication,
		onEditGroup,
		onToggleCollapse,
		onToggleEdit,
		onToggleNewEditor,
		onSetSaving,
		onSetNodeErr,
		onAddApplication,
		onAddGroup,
	} = props;

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<div className="w-full h-full text-white ">
				<ul className="flex w-auto whitespace-nowrap">
					{data.map((item, index) => (
						<RenderNodesRecursively
							key={`__node__${item.id}`}
							data={item}
							nodeDepth={0}
							nodeId={item.id}
							nodePath={[{ pathId: item.id, pathName: item.name }]}
							expandNodesAtLevel={expandNodesAtLevel}
							onEditApplication={onEditApplication}
							onEditGroup={onEditGroup}
							onToggleCollapse={onToggleCollapse}
							onAddApplication={onAddApplication}
							onAddGroup={onAddGroup}
							onSetNodeErr={onSetNodeErr}
							onSetSaving={onSetSaving}
							onToggleEdit={onToggleEdit}
							onToggleNewEditor={onToggleNewEditor}
						/>
					))}
				</ul>
			</div>
		</ErrorBoundary>
	);
};
