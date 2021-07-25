import React, { useImperativeHandle, useState } from 'react';
import { TreeView } from '../../../types';
import { AddIcon, FolderIcon, PencilIcon, SpinnerIcon } from '../../icons';

interface NodePropType {
	data: TreeView;
	editNode: (val: boolean) => void;
	// toggleChildren: boolean;
	// toggleNode: (val: boolean) => void;
	toggleNewEditor: (val: '' | 'Application' | 'Group') => void;
	isLoadingChildren: boolean;
}

type ToggleDispatch = (val: boolean) => void;

export type NodeRef = {
	toggleChild: (val: boolean, cb: ToggleDispatch) => void;
};

const NodeLoadingIndicator = () => (
	<button
		type="button"
		className="flex flex-col items-center justify-center w-6 h-6 text-left rounded-sm cursor-pointer bg-gray-">
		<SpinnerIcon className="" width={20} height={20} />
	</button>
);

export const Node = React.forwardRef<NodeRef, NodePropType>((props, ref) => {
	const { data, editNode, toggleNewEditor, isLoadingChildren } = props;
	const [toggleChildren, setToggleNode] = useState(false);

	useImperativeHandle<NodeRef, NodeRef>(
		ref,
		() => ({
			toggleChild: (val, cb) => {
				setToggleNode(val);
				cb(val);
			},
		}),
		[toggleChildren],
	);

	const expandOrCollapse = (): string => {
		if (!toggleChildren) return 'expand';
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
		<div className="h-10.5 my-1 flex flex-row items-center justify-start w-full pl-2 pr-4 -ml-4 space-x-2 transition-colors duration-300 ease-linear transform group hover:bg-skyblue node-container">
			<>
				{isLoadingChildren ? (
					<NodeLoadingIndicator />
				) : (
					<button
						type="button"
						className={`flex flex-col items-center justify-center w-5 h-5 text-center text-gray-600 bg-gray-100 rounded-sm cursor-pointer
								${expandOrCollapse()}
								`}
						onClick={() => setToggleNode(!toggleChildren)}>
						<></>
					</button>
				)}
			</>
			<button
				id={data.name
					.split(' ')
					.join('_')
					.toLowerCase()
					.toString()
					.concat('____', data.id.toString())}
				type="button"
				className="w-full flex items-center text-left pl-` h-10.5 border-indigo-200"
				onClick={() => setToggleNode(!toggleChildren)}>
				{data?.name}{' '}
				{data?.value ? `(${data?.value.toString().trimLeft()})` : ''}
			</button>
			<div className="flex space-x-3 node-actions">
				<button
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
					type="button"
					title="Add Application Group"
					onClick={() => {
						toggleNewEditor('Group');
					}}
					className={`cursor-pointer ${canAddGroup(data) ? '' : 'hidden'}`}>
					<FolderIcon className="" width={18} height={18} />
				</button>
				<button
					type="button"
					title="Edit Node"
					onClick={() => {
						editNode(true);
					}}
					className="cursor-pointer">
					<PencilIcon className="" width={18} height={18} />
				</button>
			</div>
		</div>
	);
});
