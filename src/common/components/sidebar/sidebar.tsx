import React, { useEffect } from 'react';
import { HierarchyTree } from '..';
import { useDetachStore, useHierarchyStore } from '../../../state';
import Searchbar from '../searchbar/Searchbar';
import { useHierarchyHelper } from './hooks/useHierarchyHelper';
import './sidebar.scss';

const SidebarContent = () => {
	const {
		setNodeErrorFn,
		setSavingFn,
		toggleNewEditorFn,
		toggleEditNodeFn,
		toggleCollapseNodeFn,
		onEditGroupFn,
		onEditApplicationFn,
		onAddApplicationFn,
		onAddGroupFn,
	} = useHierarchyHelper();

	const widthStyle = { width: '96%', height: 'inherit' };
	const {
		initializeHierarchyState,
		hierarchyData,
		setLoading,
		loadApplication,
	} = useHierarchyStore();

	useEffect(() => {
		initializeHierarchyState(0);
		setLoading(true);
		loadApplication();
	}, []);

	const dSSidebarState = useDetachStore(state => state.detachSidebar);

	return (
		<>
			<div className="flex justify-center rnd-move">
				<Searchbar />
			</div>
			<br />
			<div
				className={`overflow-y-auto overflow-x-auto bg-grayblue journal-scroll ml-6 ${
					dSSidebarState ? 'h-5/6' : 'h-auto'
				}`}>
				<div className="" style={widthStyle}>
					<HierarchyTree
						onToggleCollapse={toggleCollapseNodeFn}
						onAddGroup={onAddGroupFn}
						onAddApplication={onAddApplicationFn}
						onEditApplication={onEditApplicationFn}
						onEditGroup={onEditGroupFn}
						onSetSaving={setSavingFn}
						onToggleEdit={toggleEditNodeFn}
						onToggleNewEditor={toggleNewEditorFn}
						onSetNodeErr={setNodeErrorFn}
						data={hierarchyData}
						expandNodesAtLevel={0}
					/>
				</div>
			</div>
		</>
	);
};

export const Sidebar = () => <SidebarContent />;
