import React from 'react';
import { useBreadcrumbStore } from '../../../state';
import { NodePath, TreeView } from '../../../types';
import { AddIcon, FolderIcon, PencilIcon, SpinnerIcon } from '../../icons';

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
			data-testid="node-component"
			className="h-10.5 my-1 z-30 flex flex-row items-center justify-start w-full pl-2 pr-4 -ml-4 space-x-2 transition-colors duration-300 ease-linear transform group hover:bg-skyblue node-container">
			{isLoadingChildren ? (
				<NodeLoadingIndicator />
			) : (
				<button
					data-testid="node-container"
					type="button"
					className={`flex flex-col items-center justify-center w-6 h-6 z-50 text-center text-gray-600 bg-gray-100 rounded-sm
								${expandOrCollapse()}
								`}
					onClick={toggleChildren}>
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
				className="w-full flex items-center text-left pl-` h-10.5 border-indigo-200"
				onClick={() => {
					setBreadCrumb(nodePath);
					toggleChildren();
				}}>
				{data?.name} {trim(data)}
			</button>
			<div className="flex space-x-3 node-actions">
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
					<AddIcon className="" width={18} height={18} />
				</button>
				<button
					data-testid="node-add-app-group"
					type="button"
					title="Add Application Group"
					onClick={() => {
						toggleNewEditor('Group');
					}}
					className={`cursor-pointer ${canAddGroup(data) ? '' : 'hidden'}`}>
					<FolderIcon className="" width={18} height={18} />
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
