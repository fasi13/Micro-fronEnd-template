/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TreeView } from '../../../types';
import {
	AddIcon,
	CloseIcon,
	FolderIcon,
	PencilIcon,
	SpinnerIcon,
} from '../../icons';
import './hierarchy.css';

interface NodeActions {
	onEdit: () => void;
	onSelect: () => void;
	onToggle: (
		item: TreeView,
		nodeId: number,
		nodePath: number[],
		cb: () => void,
	) => void;
	onAddApplication?: () => void;
	onAddGroup?: () => void;
	onLoadMore?: () => void;
}

interface HierarchyPropType extends NodeActions {
	data: TreeView[];
	expandNodesAtLevel?: number;
}

interface ApplicationPropType extends NodeActions {
	data: TreeView;
	index: number;
	nodeDepth: number;
	nodeId: number;
	nodePath: number[];
	expandNodesAtLevel?: number;
}

interface NodePropType extends NodeActions {
	data: TreeView;
	expandedByDefault: boolean;
	nodeId: number;
	nodePath: number[];
}
function nodeHasChildren(nodeData: TreeView) {
	return nodeData.childrenData && nodeData.childrenData.length > 0;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const TreeNode: React.FC<NodePropType> = (props): JSX.Element => {
	const {
		nodeId,
		nodePath,
		data,
		expandedByDefault,
		children,
		onToggle,
		onEdit,
		onSelect,
		onAddApplication,
		onAddGroup,
		onLoadMore,
	} = props;
	const [editNode, setEditForNode] = useState<boolean>(false);
	const [toggleChildren, setToggleChildren] = useState<boolean>(false);
	const [isFetched, setFetched] = useState<boolean>(false);
	const [isLoadingChildren, setIsLoadingChildren] = useState<boolean>(false);

	useEffect(() => {
		// eslint-disable-next-line no-debugger
		if (
			toggleChildren &&
			!isFetched &&
			(!data?.childrenData || data?.childrenData.length === 0)
		) {
			setIsLoadingChildren(true);
			onToggle(data, nodeId, nodePath, () => {
				console.log('---- inCallback');

				setIsLoadingChildren(false);
				setFetched(true);
				setToggleChildren(true);
			});
		} else console.log('toggle loaded data', isFetched, toggleChildren);
		// onToggleCb(data,()=>setIsLoading(false));
	}, [toggleChildren]);

	useEffect(() => {
		if (expandedByDefault) setToggleChildren(true);
	}, []);

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
						<>
							{isLoadingChildren ? (
								<button
									type="button"
									className="flex flex-col items-center justify-center w-6 h-6 text-center bg-gray-600 rounded-sm cursor-pointer bg-gray-">
									<SpinnerIcon className="" width={20} height={20} />
								</button>
							) : (
								<button
									type="button"
									className={`flex flex-col items-center justify-center w-5 h-5 text-center text-gray-600 bg-gray-100 rounded-sm cursor-pointer
								${
									// eslint-disable-next-line no-nested-ternary
									!nodeHasChildren(data)
										? 'expand'
										: !toggleChildren
										? 'expand'
										: 'collapse'
								}
								`}
									onClick={() => setToggleChildren(!toggleChildren)}>
									{/* <div className=" w-full h-.5 bg-skyblue" />
									<div className="relative w-.5 h-full transform rotate-180  bg-skyblue" /> */}
								</button>
							)}
						</>
						<div className="w-full flex items-center h-10.5 border-indigo-200">
							{data.name} {`isLoading: ${isLoadingChildren}`}{' '}
							{`toggleChildren: ${toggleChildren}`}{' '}
							{`expandedByDefault: ${expandedByDefault}`}{' '}
							{`isFetched: ${isFetched}`}
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
			{/* {toggleChildren || expandedByDefault ? <>{children}</> : <></>} */}
			<div className={`${toggleChildren || expandedByDefault ? '' : 'hidden'}`}>
				{children}
			</div>
		</>
	);
};

//  we can not have hooks inside RenderNodesrecursively bc we will get Rendered more hooks than during the previous render
// so have all ur hooks in treeNode.

const RenderNodesRecursively: React.FC<ApplicationPropType> = (
	props,
): JSX.Element => {
	// const [editNode, setEditForNode] = useState<boolean>(false);
	const {
		data,
		index,
		nodeDepth,
		nodeId,
		nodePath,
		expandNodesAtLevel,
		children,
		onSelect,
		onEdit,
		onToggle,
		onAddApplication,
		onAddGroup,
		onLoadMore,
	} = props;
	// function checkToExpandNode(i: number, toExpandNodeIndex: number[]): boolean {
	// 	return toExpandNodeIndex.indexOf(i) === i;
	// }
	return (
		<li className="relative flex flex-col items-start justify-center h-auto mr-8 list-none tree">
			<div className="w-full h-full">
				<TreeNode
					nodeId={nodeId}
					nodePath={nodePath}
					data={data}
					expandedByDefault={
						expandNodesAtLevel !== undefined
							? nodeDepth <= expandNodesAtLevel
							: false
					}
					onEdit={onEdit}
					onSelect={onSelect}
					onToggle={onToggle}
					onAddApplication={onAddApplication}
					onAddGroup={onAddGroup}>
					{
						// eslint-disable-next-line no-nested-ternary
						!data.childrenData ? (
							<></>
						) : data.childrenData.length === 0 ? (
							<></>
						) : (
							<ul className="w-full pl-5 ml-2 B">
								{data.childrenData.map((c, ci) => (
									<li
										key={`__li__${c.name}__`}
										className={`__li__${c.name}__ relative flex flex-col items-start justify-center h-auto list-none tree`}>
										<ul className="w-full">
											{RenderNodesRecursively({
												data: c,
												nodeId: c.id,
												index: ci,
												nodeDepth: nodeDepth + 1,
												nodePath: [...nodePath, c.id],
												expandNodesAtLevel: props.expandNodesAtLevel,
												onEdit: props.onEdit,
												onSelect: props.onSelect,
												onToggle: props.onToggle,
												onAddApplication: props.onAddApplication,
												onAddGroup: props.onAddGroup,
												onLoadMore: props.onLoadMore,
											})}
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
		expandNodesAtLevel,
		children,
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
					<RenderNodesRecursively
						key={`__node__${item.name}__}`}
						data={item}
						index={index}
						nodeDepth={0}
						nodeId={item.id}
						nodePath={[-1]}
						expandNodesAtLevel={expandNodesAtLevel}
						onEdit={onEdit}
						onSelect={onSelect}
						onToggle={onToggle}
						onAddApplication={onAddApplication}
						onAddGroup={onAddGroup}
						onLoadMore={onLoadMore}
					/>
				))}
			</ul>
		</div>
	);
};
