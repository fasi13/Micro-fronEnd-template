import { useCallback } from 'react';
import { useHierarchyStore } from '../../../state';
import { ErrorResponse, NodePath, TEditor, TreeView } from '../../../types';

export const useHierarchyHelper = () => {
	const {
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

	const setNodeErrorFn = useCallback(
		(nodePath: NodePath[], val: string | ErrorResponse | null) => {
			setNodeError(nodePath, val);
		},
		[],
	);
	const setSavingFn = useCallback((nodePath: NodePath[], val: boolean) => {
		setSaving(nodePath, val);
	}, []);
	const toggleNewEditorFn = useCallback(
		(nodePath: NodePath[], val: TEditor) => {
			toggleNewEditor(nodePath, val);
		},
		[],
	);
	const toggleEditNodeFn = useCallback((nodePath: NodePath[], val: boolean) => {
		toggleEdit(nodePath, val);
	}, []);
	const toggleCollapseNodeFn = useCallback(
		(nodePath: NodePath[], val: boolean) => {
			// eslint-disable-next-line no-debugger
			toggleCollapse(nodePath, val);
		},
		[],
	);
	const onEditGroupFn = useCallback(
		async (item: TreeView, nodePath: NodePath[], name: string) => {
			editApplicationGroup(item, nodePath, name);
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
	const onAddGroupFn = useCallback(
		async (item: TreeView, nodePath: NodePath[], name: string) => {
			createApplicationGroup(item, nodePath, name);
		},
		[],
	);
	return {
		setNodeErrorFn,
		setSavingFn,
		toggleNewEditorFn,
		toggleEditNodeFn,
		toggleCollapseNodeFn,
		onEditGroupFn,
		onEditApplicationFn,
		onAddApplicationFn,
		onAddGroupFn,
	};
};
