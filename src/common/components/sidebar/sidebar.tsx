import React, { useCallback, useEffect } from 'react';
import { HierarchyTree } from '..';
import { detachStore, useHierarchyStore } from '../../../state';
import { ErrorResponse, NodePath, TEditor, TreeView } from '../../../types';
import Searchbar from '../searchbar/Searchbar';
import './sidebar.scss';

const SidebarContent = () => {
	// const searchLoading = open && searchData.length === 0;

	const widthStyle = { width: '96%', height: 'inherit' };
	const {
		initializeHierarchyState,
		hierarchyData,
		setLoading,
		getUserApplication,
		createApplicationGroup,
		createApplication,
		editApplication,
		editApplicationGroup,
		toggleCollapse,
		toggleEdit,
		toggleNewEditor,
		setSaving,
		setNodeError,
	} = useHierarchyStore();

	useEffect(() => {
		initializeHierarchyState(0);
		setLoading(true);
		getUserApplication();
	}, []);

	const dSSidebarState = detachStore(state => state.detachSidebar);

	const onAddGroupFn = useCallback(
		async (item: TreeView, nodePath: NodePath[], name: string) => {
			createApplicationGroup(item, nodePath, name);
		},
		[],
	);

	const onAddApplicationFn = useCallback(
		async (
			item: TreeView,
			nodePath: NodePath[],
			name: string,
			value: string,
		) => {
			createApplication(item, nodePath, name, value);
		},
		[],
	);

	const onEditApplicationFn = useCallback(
		async (
			item: TreeView,
			nodePath: NodePath[],
			name: string,
			value: string,
		) => {
			editApplication(item, nodePath, name, value);
		},
		[],
	);

	const onEditGroupFn = useCallback(
		async (item: TreeView, nodePath: NodePath[], name: string) => {
			editApplicationGroup(item, nodePath, name);
		},
		[],
	);

	const toggleCollapseNodeFn = useCallback(
		(nodePath: NodePath[], val: boolean) => {
			toggleCollapse(nodePath, val);
		},
		[],
	);

	const toggleEditNodeFn = useCallback((nodePath: NodePath[], val: boolean) => {
		toggleEdit(nodePath, val);
	}, []);

	const toggleNewEditorFn = useCallback(
		(nodePath: NodePath[], val: TEditor) => {
			toggleNewEditor(nodePath, val);
		},
		[],
	);

	const setSavingFn = useCallback((nodePath: NodePath[], val: boolean) => {
		setSaving(nodePath, val);
	}, []);

	const setNodeErrorFn = useCallback(
		(nodePath: NodePath[], val: string | ErrorResponse | null) => {
			setNodeError(nodePath, val);
		},
		[],
	);

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
