/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { ItreeData } from '../../types';
import { AddIcon, CloseIcon, FolderIcon, PencilIcon } from '../icons';
import './hierarchy.css';

interface HierarchyPropType {
	onSelect: () => void;
	onToggle: () => void;
	onEdit: () => void;
	onAddGroup?: () => void;
	onAddApplication?: () => void;
	onLoadMore?: () => void;
	data: ItreeData[];
}

interface ApplicationPropType {
	data: ItreeData;
	index: number;
}

interface NodePropType {
	data: ItreeData;
}
const TreeNode: React.FC<NodePropType> = (props): JSX.Element => {
	const { data, children } = props;
	const [editNode, setEditForNode] = useState<boolean>(false);
	const [toggleChildren, setToggleChildren] = useState<boolean>(false);
	const [isFetched, setFetched] = useState<boolean>(false);
	const [isLoadingChildren, setIsLoadingChildren] = useState<boolean>(false);

	useEffect(() => {
		if (toggleChildren && !isFetched) {
			setFetched(true);
			setIsLoadingChildren(true);
			// onToggleCb(data,()=>setIsLoading(false));
		}
	}, [toggleChildren]);

	function nodeHasChildren(nodeData: ItreeData) {
		return nodeData.children && nodeData.children.length > 0;
	}
	return (
		<>
			<div className="h-10.5 w-ful">
				{editNode ? (
					<div className="h-10.5 flex flex-row items-center justify-start w-full pl-2 pr-4 -ml-4 space-x-2 transition-colors duration-300 ease-linear transform">
						<div className="relative h-full shadow-sm">
							<input
								type="text"
								name="edit_node"
								id="edit_application"
								className="block w-full h-full pl-2 text-gray-900 placeholder-gray-500 bg-gray-300 border-transparent pr-14 flex-2 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
								placeholder="New Item"
								aria-invalid="false"
								aria-describedby="email-error"
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 flex items-center justify-center w-12 font-light border border-transparent focus:ring-0 focus:outline-none bg-faded-skyblue"
								onClick={() => setEditForNode(false)}>
								<CloseIcon className="" width={14} height={14} />
							</button>
						</div>
					</div>
				) : (
					<div className="h-10.5 flex flex-row items-center justify-start w-full pl-2 pr-4 -ml-4 space-x-2 transition-colors duration-300 ease-linear transform group hover:bg-skyblue">
						<button
							type="button"
							className={`flex flex-col items-center justify-center w-5 h-5 text-center text-gray-600 bg-gray-100 rounded-sm ${
								// eslint-disable-next-line no-nested-ternary
								!nodeHasChildren(data)
									? 'toggle-empty'
									: !toggleChildren
									? 'toggle-expand'
									: 'toggle-collapse'
							}`}
							onClick={() => setToggleChildren(!toggleChildren)}>
							{/* <div className=" w-full h-.5 bg-skyblue" />
									<div className="relative w-.5 h-full transform rotate-180  bg-skyblue" /> */}
						</button>
						<div className="w-full flex items-center h-10.5 border-indigo-200">
							{data.name} {`${toggleChildren}`}
						</div>
						<div className="flex space-x-3">
							<div className="opacity-0 cursor-pointer group-hover:opacity-100">
								<AddIcon className="" width={18} height={18} />
							</div>
							<div className="opacity-0 cursor-pointer group-hover:opacity-100">
								<FolderIcon className="" width={18} height={18} />
							</div>
							<button
								type="button"
								onClick={() => {
									setEditForNode(!editNode);
								}}
								className="opacity-0 cursor-pointer group-hover:opacity-100">
								<PencilIcon className="" width={18} height={18} />
							</button>
						</div>
					</div>
				)}
			</div>
			{toggleChildren ? <>{children}</> : <></>}
		</>
	);
};

const RenderNodesRecursively: React.FC<ApplicationPropType> = (
	props,
): JSX.Element => {
	const [editNode, setEditForNode] = useState<boolean>(false);
	const { data, index, children } = props;
	return (
		<li
			data-testid={`__topapplication_${index}`}
			key={
				data.key
					? `__topapplication__${data.key}`
					: `__topapplication__${index}`
			}
			className="relative flex flex-col items-start justify-center h-auto mr-8 list-none tree">
			<div className="w-full h-full">
				<TreeNode data={data}>
					{
						// eslint-disable-next-line no-nested-ternary
						!data.children ? (
							<></>
						) : data.children.length === 0 ? (
							<></>
						) : (
							<ul className="w-full pl-5 ml-2 B">
								{data.children.map((c, ci) => (
									<li
										key={
											data.key
												? `__topapplication__child__${index}__${c.key}`
												: `__topapplication__child__${index}__${ci}`
										}
										className="relative flex flex-col items-start justify-center h-auto list-none tree">
										<ul className="w-full">
											{RenderNodesRecursively({ data: c, index: ci })}
										</ul>
									</li>
								))}
							</ul>
						)
					}
				</TreeNode>
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
		onEdit,
		onSelect,
		onToggle,
		onAddApplication,
		onAddGroup,
		onLoadMore,
	} = props;

	return (
		<div className="w-full h-full text-white bg-gray-600">
			<ul className="inset-y-0 left-0 z-10 w-full h-full pl-5 ml-3 overflow-hidden">
				{data.map((item, index) => (
					<RenderNodesRecursively data={item} index={index} />
				))}
			</ul>
		</div>
	);
};
