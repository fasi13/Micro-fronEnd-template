import React, { useRef } from 'react';
import { useBreadcrumbStore } from '../../../state';
import { NodePath, TreeView } from '../../../types';
import {
	AddIcon,
	GroupAddIcon,
	PencilIcon,
	SpinnerIcon
} from '../../icons';

interface NodePropType {
	data: TreeView;
	nodePath: NodePath[];
	editNode: () => void;
	toggleChildren: () => void;
	toggleNewEditor: (val: '' | 'Application' | 'Group') => void;
	isLoadingChildren: boolean;
}

const NodeLoadingIndicator = () => (
	<button
		data-testid="loading-indicator"
		type="button"
		className="flex flex-col items-center justify-center w-6 h-6 text-left rounded-sm cursor-pointer bg-gray-">
		<SpinnerIcon className="" width={20} height={20} />
	</button>
);

export const trim = (x: TreeView): string => {
	if (x?.value) {
		return `(${x?.value.toString().trimLeft()})`;
	}
	return '';
};

export const Node: React.FC<NodePropType> = props => {
	const {
		data,
		nodePath,
		editNode,
		toggleNewEditor,
		isLoadingChildren,
		toggleChildren,
	} = props;

	const nodeRef = useRef<HTMLDivElement>(null);
	const { setBreadCrumb } = useBreadcrumbStore();

	const expandOrCollapse = (): string => {
		if (data.collapsed) return 'expand';
		return 'collapse';
	};

	const canAddApplication = (node: TreeView): boolean => {
		if (node._links?.find(l => l.rel === 'createApplication')) return true;
		return false;
	};

	const canAddGroup = (node: TreeView): boolean => {
		if (node._links?.find(l => l.rel === 'createApplicationGroup')) return true;
		return false;
	};

	return (
		<div
			ref={nodeRef}
			data-testid="node-component"
			className="flex justify-start items-center h-10.5 my-1 z-30 pl-2 pr-4 -ml-4 space-x-2 transition-colors duration-300 ease-linear transform group hover:bg-skyblue node-container">
			{isLoadingChildren ? (
				<NodeLoadingIndicator />
			) : (
				<button
					data-testid="node-container"
					type="button"
					className={`flex  flex-none  flex-col items-center justify-center w-4 h-4 z-50 text-center text-gray-600 bg-gray-100 rounded-sm
								${expandOrCollapse()}
								`}
					onClick={() => {
						toggleChildren();
					}}>
					<></>
				</button>
			)}
			<button
				data-testid="node-labels"
				id={data.name
					.split(' ')
					.join('_')
					.toLowerCase()
					.toString()
					.concat('____', data.id.toString())}
				type="button"
				className="flex-shrink-0 flex-auto flex items-center text-left pl-1` h-10.5 border-indigo-200"
				onClick={() => {
					setBreadCrumb(nodePath);
					toggleChildren();
				}}>
				<GroupAddIcon
					className={`${
						canAddApplication(data) ? 'mr-2 flex-none' : 'hidden mr-2'
					}`}
					width={18}
					height={18}
				/>
				{data?.name} {trim(data)}
			</button>
			<div className="flex flex-shrink-0 flex-1 space-x-3 pl-16 node-actions">
				<button
					data-testid="node-add-app"
					type="button"
					title="Add Application"
					onClick={() => {
						toggleNewEditor('Application');
					}}
					className={`cursor-pointer ${
						canAddApplication(data) ? '' : 'hidden'
					}`}>
					<AddIcon className="" width={18} height={15} />
				</button>
				<button
					data-testid="node-add-app-group"
					type="button"
					title="Add Application Group"
					onClick={() => {
						toggleNewEditor('Group');
					}}
					className={`cursor-pointer ${canAddGroup(data) ? '' : 'hidden'}`}>
					<GroupAddIcon className="" width={18} height={18} />
				</button>
				<button
					data-testid="node-edit"
					type="button"
					title="Edit Node"
					onClick={() => {
						editNode();
					}}
					className="cursor-pointer">
					<PencilIcon className="" width={18} height={18} />
				</button>
			</div>
		</div>
	);
};
