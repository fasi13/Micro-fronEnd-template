import React, { useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { HierarchyTree } from '..';
import { detachStore, useHierarchyStore } from '../../../state';
import { TreeView } from '../../../types';

const SidebarContent = () => {
	const {
		initializeHierarchyState,
		hierarchyData,
		setLoading,
		getHierarchyChildData,
		getUserApplication,
		createApplicationGroup,
		createApplication,
		editApplication,
		editApplicationGroup,
	} = useHierarchyStore();

	useEffect(() => {
		initializeHierarchyState();
		setLoading(true);
		getUserApplication();
	}, []);

	return (
		<>
			<div className="w-full overflow-visible bg-grayblue">
				<HierarchyTree
					onSelect={() => {
						console.log('hi');
					}}
					onToggle={async (
						item: TreeView,
						nodeId: number,
						nodePath: number[],
						cb: () => void,
					) => {
						await getHierarchyChildData(item, nodeId, nodePath);
						cb();
					}}
					onAddGroup={async (
						item: TreeView,
						nodeId: number,
						nodePath: number[],
						name: string,
						cb: (err: any) => void,
					) => {
						await createApplicationGroup(item, nodeId, nodePath, name);
						cb(null);
					}}
					onAddApplication={async (
						item: TreeView,
						nodeId: number,
						nodePath: number[],
						name: string,
						value: string,
						cb: (err: any) => void,
					) => {
						await createApplication(item, nodeId, nodePath, name, value);
						cb(null);
					}}
					onEditApplication={async (
						item: TreeView,
						nodeId: number,
						nodePath: number[],
						name: string,
						value: string,
						cb: (err: any) => void,
					) => {
						await editApplication(item, nodeId, nodePath, name, value);
						cb(null);
					}}
					onEditGroup={async (
						item: TreeView,
						nodeId: number,
						nodePath: number[],
						name: string,
						cb: (err: any) => void,
					) => {
						await editApplicationGroup(item, nodeId, nodePath, name);
						cb(null);
					}}
					data={hierarchyData}
					expandNodesAtLevel={0}
				/>
			</div>
		</>
	);
};

export const Sidebar = () => {
	const style = {
		display: 'flex',
		alignItems: 'start',
		justifyContent: 'center',
		background: '#31506A',
		zIndex: 99999,
		top: '35px !important',
		left: '35px !important',
		boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
	};
	const dSOpen = detachStore(state => state.setOpen);
	const dSSetDetachSidebar = detachStore(state => state.setDetachSidebar);
	const dSSidebarState = detachStore(state => state.detachSidebar);

	const setOpen = (opn: boolean) => {
		dSOpen(opn);
	};
	const setTearSidebar = (detach: boolean) => {
		setOpen(false);
		dSSetDetachSidebar(detach);
	};
	const handleAttach = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			setTearSidebar(false);
	};

	return dSSidebarState ? (
		<Rnd
			style={style}
			default={{
				x: 500,
				y: 0,
				width: 840,
				height: 600,
			}}>
			<div className="w-full h-full m-4 mr-1 overflow-y-auto">
				<SidebarContent />
			</div>
			<div
				onKeyDown={() => handleAttach}
				role="button"
				tabIndex={0}
				aria-label="close-tear"
				style={{
					fontSize: 20,
					background: '#31506A',
					borderRadius: '0px 8px 8px 0px',
					color: 'white',
					boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
				}}
				id="icon"
				onClick={handleAttach}>
				x
			</div>
		</Rnd>
	) : (
		<SidebarContent />
	);
};
