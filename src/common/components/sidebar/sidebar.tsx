/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { HierarchyTree } from '..';
import { detachStore, useHierarchyStore } from '../../../state';
import Searchbar from '../searchbar/Searchbar';
import './sidebar.scss';
import { useHierarchyHelper } from './useHierarchyHelper';

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

	const dSSidebarState = detachStore(state => state.detachSidebar);

	return (
		<>
			<div className="flex justify-center rnd-move">
				<Searchbar />
			</div>
			<br />
			{/* CodeReview:  Providing style like that will make it re render on every change please look into useMemo or useCallback */}
			<div
				className="overflow-y-auto bg-grayblue journal-scroll"
				style={dSSidebarState ? { height: '83%' } : { height: 'inherit' }}>
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
