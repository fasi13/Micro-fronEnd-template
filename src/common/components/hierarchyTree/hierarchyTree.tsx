/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useWhyDidYouUpdate } from 'use-hooks';
import { NodeActions, TreeView } from '../../../types';
import { ErrorFallback } from './errorFallback';
import './hierarchy.css';
import { RenderNodesRecursively } from './renderNodesRecursively';

interface HierarchyPropType extends NodeActions {
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
