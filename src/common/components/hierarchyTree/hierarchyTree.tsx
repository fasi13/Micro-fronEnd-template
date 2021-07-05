/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TreeView } from '../../../types';
import {
	AddIcon,
	CloseIcon,
	FolderIcon,
	PencilIcon,
	SpinnerIcon
} from '../../icons';
import './hierarchy.css';

interface NodeActions {
	onSelect: () => void;
	onToggle: (
		item: TreeView,
		nodeId: number,
		nodePath: number[],
		cb: () => void,
	) => void;
	onAddApplication: (
		item: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
		value: string,
		cb: (err: any) => void,
	) => void;
	onAddGroup: (
		item: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
		cb: (err: any) => void,
	) => void;
	onEditApplication: (
		item: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
		value:string,
		cb: (err: any) => void,
	) => void;
		onEditGroup: (
		item: TreeView,
		nodeId: number,
		nodePath: number[],
		name: string,
		cb: (err:any) => void,
	) => void;
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

interface NodeEditorPropType {
	onClose: () => void;
	onSubmit: (value:string) => void;
	defaultValue: string;
	data?: string;
}

const HandleErrorMessage = 'Handle Error';


const NodeEditor: React.FC<NodeEditorPropType> = (props) => {
	  const {onClose, onSubmit,defaultValue,data, children} = props;
		const [value,setValue] = useState(data || '');

			return (
				<div className="h-10.5 flex flex-row items-center justify-start w-full pl-2 pr-4 -ml-4 space-x-2 transition-colors duration-300 ease-linear transform">
					<div className="relative h-full shadow-sm">
						<input
							type="text"
							name="edit_node"
							id="edit_application"
							className="block w-full h-full pl-2 text-gray-900 placeholder-gray-500 bg-gray-300 border-transparent pr-14 flex-2 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
							placeholder={defaultValue}
							aria-invalid="false"
							aria-describedby="email-error"
							value={value}
							onChange={e => setValue(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') onSubmit(value);
							}}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 flex items-center justify-center w-12 font-light border border-transparent focus:ring-0 focus:outline-none bg-faded-skyblue"
							onClick={() => onClose()}>
							<CloseIcon className="" width={14} height={14} />
						</button>
					</div>
				</div>
			);
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
		onEditApplication,
		onEditGroup,
		onSelect,
		onAddApplication,
		onAddGroup,
		onLoadMore,
	} = props;
	const [editNode, setEditForNode] = useState<boolean>(false);
	const [toggleChildren, setToggleChildren] = useState<boolean>(false);
	const [isFetched, setFetched] = useState<boolean>(false);
	const [isLoadingChildren, setIsLoadingChildren] = useState<boolean>(false);
	const [newApplication, setNewApplication] = useState<string>();
	const [toggleNewApplicationOrGroupCtrl,setToggleNewApplicationOrGroupCtrl] = useState<"Application"|"Group"|"">("");
	const [newApplicationGroup, setNewApplicationGroup] = useState<string>();
	const [applicationGroupName, setApplicationGroupName] = useState<string>();
  const [applicationName,setApplicationName] = useState<string>();



	useEffect(() => {
		// eslint-disable-next-line no-debugger
		if (
			toggleChildren &&
			!isFetched &&
			(!data?.childrenData || data?.childrenData.length === 0)
		) {
			setIsLoadingChildren(true);
			onToggle(data, nodeId, nodePath, () => {

				setIsLoadingChildren(false);
				setFetched(true);
				setToggleChildren(true);
			});
		} else console.log('toggle loaded data', isFetched, toggleChildren);
		// onToggleCb(data,()=>setIsLoading(false));
	}, [toggleChildren]);

	useEffect(() => {
		if (newApplication) {
			setIsLoadingChildren(true);
			onAddApplication(
				data,
				nodeId,
				nodePath,
				newApplication || '',
				'',
				(err) => {
					if(err)
						console.log(HandleErrorMessage);
					else
					{
						setToggleNewApplicationOrGroupCtrl("");
						setIsLoadingChildren(true);
						// eslint-disable-next-line sonarjs/no-identical-functions
						onToggle(data, nodeId, nodePath, () => {
							console.log('---- inCallback');
							setIsLoadingChildren(false);
							setFetched(true);
							setToggleChildren(true);
						});
					}

					setIsLoadingChildren(false);
				},
			);
		}
	}, [newApplication]);

	useEffect(() => {
		if (newApplicationGroup) {

			setIsLoadingChildren(true);
			onAddGroup(data, nodeId, nodePath, newApplicationGroup || '', (err) => {
				if(err)
						console.log(HandleErrorMessage);
				else
				{
							setIsLoadingChildren(false);
							setToggleNewApplicationOrGroupCtrl('');
							setIsLoadingChildren(true);
							// eslint-disable-next-line sonarjs/no-identical-functions
							onToggle(data, nodeId, nodePath, () => {
								console.log('---- inCallback');
								setIsLoadingChildren(false);
								setFetched(true);
								setToggleChildren(true);
							});
				}

			});
		}
	}, [newApplicationGroup]);

	useEffect(()=>{
		if(applicationGroupName){
			// eslint-disable-next-line no-debugger
			debugger;
			onEditGroup(data,nodeId,nodePath,applicationGroupName, (err)=>{
				if(err){
					console.log(HandleErrorMessage);
				}
				else{
					setEditForNode(false);
				}
			})
		}
	},[applicationGroupName]);

		useEffect(() => {
			console.log("Application name set ..............",applicationName);
			if (applicationName) {
				onEditGroup(data, nodeId, nodePath, applicationName, err => {
					if (err) {
						console.log('Handle Error');
					} else {
						setEditForNode(false);
					}
				});
			}
		}, [applicationName]);

	useEffect(() => {
		if (expandedByDefault) setToggleChildren(true);
	}, []);

	const canAddGroup = (node: TreeView): boolean => {
		if (node._links?.find(l => l.rel === 'createApplicationGroup')) return true;
		return false;
	};

	const canAddApplication = (node: TreeView): boolean => {
		if (node._links?.find(l => l.rel === 'createApplication')) return true;
		return false;
	};


	return (
		<>
			<div className="h-10.5 w-ful">
				{editNode ? (
					<NodeEditor
						onClose={() => setEditForNode(false)}
						onSubmit={ value =>
							canAddApplication(data)
								? setApplicationGroupName(value)
								: setApplicationName(value)

					}
						defaultValue=''
						data={data.name}
					/>
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
						<button
							type="button"
							className="w-full flex items-center h-10.5 border-indigo-200"
							onClick={() => setToggleChildren(!toggleChildren)}>
							{data.name}
						</button>
						<div className="flex space-x-3">
							<button
								type="button"
								onClick={() => {
									if (!toggleChildren) setToggleChildren(!toggleChildren);
									setToggleNewApplicationOrGroupCtrl('Application');
								}}
								className={`opacity-0 cursor-pointer group-hover:opacity-100 ${
									canAddApplication(data) ? '' : 'hidden'
								}`}>
								<AddIcon className="" width={18} height={18} />
							</button>
							<button
								type="button"
								onClick={() => {
									if (!toggleChildren) setToggleChildren(!toggleChildren);
									setToggleNewApplicationOrGroupCtrl('Group');
								}}
								className={`opacity-0 cursor-pointer group-hover:opacity-100 ${
									canAddGroup(data) ? '' : 'hidden'
								}`}>
								<FolderIcon className="" width={18} height={18} />
							</button>
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
			<div className={`${toggleChildren || expandedByDefault ? '' : 'hidden'}`}>
				{toggleNewApplicationOrGroupCtrl !== '' ? (
					<ul className="w-full pl-5 ml-2 B">
						<li className="relative flex flex-col items-start justify-center h-auto list-none tree">
							<NodeEditor
								onClose={() => setToggleNewApplicationOrGroupCtrl('')}
								onSubmit={value =>
									toggleNewApplicationOrGroupCtrl === 'Application'
										? setNewApplication(value)
										: setNewApplicationGroup(value)
								}
								defaultValue={
									toggleNewApplicationOrGroupCtrl === 'Application'
										? 'Add New Application'
										: 'Add New Application Group'
								}
							/>
						</li>
					</ul>
				) : (
					<></>
				)}

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
		onEditApplication,
		onEditGroup,
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
					onEditApplication={onEditApplication}
					onEditGroup={onEditGroup}
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
												onEditApplication: props.onEditApplication,
												onEditGroup: props.onEditGroup,
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
		onEditApplication,
		onEditGroup,
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
						onEditApplication={onEditApplication}
						onEditGroup={onEditGroup}
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



