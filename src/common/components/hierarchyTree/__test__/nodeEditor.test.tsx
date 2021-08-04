import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useHierarchyStore } from '../../../../state';
import { ErrorResponse, TreeView } from '../../../../types';
import { NodeEditor } from '../nodeEditor';

const nodeEditorInputStr = 'node-editor-input';
describe('hierarchy store', () => {
	const dummyTreeView: TreeView[] = [
		{
			id: 0,
			name: 'dummy',
			collapsed: false,
			edit: false,
			error: null,
			saving: false,
			loadingChildren: false,
			toggleNewEditor: '',
			nodeDepth: 0,
			nodePath: [{ pathId: 0, pathName: 'dummy' }],
			_links: [
				{
					href: 'dummy/selfupdate',
					method: { method: 'GET' },
					name: 'updateSelf',
					rel: 'updateApplicationGroup',
				},
				{
					href: 'dummy/selfupdate',
					method: { method: 'GET' },
					name: 'updateSelf',
					rel: 'updateApplication',
				},
				{
					href: 'dummy/createGroup',
					method: { method: 'POST' },
					name: 'createGroup',
					rel: 'createApplicationGroup',
				},
				{
					href: 'dummy/createApp',
					method: { method: 'POST' },
					name: 'createApp',
					rel: 'createApplication',
				},
				{
					href: 'dummy/createGroup',
					method: { method: 'POST' },
					name: 'createGroup',
					rel: '',
				},
				{
					href: 'dummy/createApp',
					method: { method: 'POST' },
					name: 'createApp',
					rel: '',
				},
				{
					href: 'dummy/children_application',
					method: { method: 'GET' },
					name: 'getChildren',
					rel: 'applications',
				},
				{
					href: 'dummy/children_applicationGroup',
					method: { method: 'GET' },
					name: 'getChildren',
					rel: 'applicationGroups',
				},
			],
		},
	];
	beforeEach(() => {
		useHierarchyStore.setState({
			...useHierarchyStore.getState(),
			hierarchyData: [...dummyTreeView],
		});
	});

	test('node editor input should accept user input', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = jest.fn();

		const { getByTestId } = render(
			<NodeEditor
				key={`node_editor_${dummyTreeView[0].id}`}
				onClose={() => {
					onToggleEdit(dummyTreeView[0].nodePath, false);
				}}
				onSubmit={submitHandler}
				error={dummyTreeView[0].error}
				isSaving={dummyTreeView[0].saving}
				isApplication
				data="test-data"
				setError={onSetNodeErr()}
				clearError={onSetNodeErr()}
			/>,
		);
		const input = getByTestId(nodeEditorInputStr) as HTMLInputElement;
		fireEvent.change(input, {
			target: { value: 'test' },
		});
		expect(input.value).toBe('test');
	});

	test('node editor should validate if the input is empty', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = (val: string | ErrorResponse) => {
			useHierarchyStore.getState().setNodeError(dummyTreeView[0].nodePath, val);
		};

		const { getByTestId, debug } = render(
			<NodeEditor
				key={`node_editor_${dummyTreeView[0].id}`}
				onClose={() => {
					onToggleEdit(dummyTreeView[0].nodePath, false);
				}}
				onSubmit={submitHandler}
				error={dummyTreeView[0].error}
				isSaving={dummyTreeView[0].saving}
				isApplication
				data=""
				setError={val => {
					onSetNodeErr(val);
				}}
				clearError={() => onSetNodeErr('')}
			/>,
		);
		const input = getByTestId(nodeEditorInputStr) as HTMLInputElement;
		fireEvent.change(input, {
			target: { value: '' },
		});
		userEvent.type(input, '{enter}');
		debug();
		expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
			'Value can not be empty',
		);
	});

	test('node editor should validate if the input is not correct', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = (val: string | ErrorResponse) => {
			useHierarchyStore.getState().setNodeError(dummyTreeView[0].nodePath, val);
		};

		const { getByTestId, debug } = render(
			<NodeEditor
				key={`node_editor_${dummyTreeView[0].id}`}
				onClose={() => {
					onToggleEdit(dummyTreeView[0].nodePath, false);
				}}
				onSubmit={submitHandler}
				error={dummyTreeView[0].error}
				isSaving={dummyTreeView[0].saving}
				isApplication
				data=""
				setError={val => {
					onSetNodeErr(val);
				}}
				clearError={() => onSetNodeErr('')}
			/>,
		);
		const input = getByTestId(nodeEditorInputStr) as HTMLInputElement;
		fireEvent.change(input, {
			target: { value: 'test' },
		});
		userEvent.type(input, '{enter}');
		debug();
		expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
			'Application format should be: Application Name (Value)',
		);
	});

	test('node editor should clear error message if the input is correct', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = (val: string | ErrorResponse) => {
			useHierarchyStore.getState().setNodeError(dummyTreeView[0].nodePath, val);
		};

		const { getByTestId, debug } = render(
			<NodeEditor
				key={`node_editor_${dummyTreeView[0].id}`}
				onClose={() => {
					onToggleEdit(dummyTreeView[0].nodePath, false);
				}}
				onSubmit={submitHandler}
				error={dummyTreeView[0].error}
				isSaving={dummyTreeView[0].saving}
				isApplication
				data=""
				setError={val => {
					onSetNodeErr(val);
				}}
				clearError={() => onSetNodeErr('')}
			/>,
		);
		const input = getByTestId(nodeEditorInputStr) as HTMLInputElement;
		fireEvent.change(input, {
			target: { value: 'test (testVal)' },
		});
		userEvent.type(input, '{enter}');
		debug();
		expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(null);
	});

	test('node editor cancel button should call correct function', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = jest.fn();

		const { getByTestId } = render(
			<NodeEditor
				key={`node_editor_${dummyTreeView[0].id}`}
				onClose={() => {
					onToggleEdit(dummyTreeView[0].nodePath, false);
				}}
				onSubmit={submitHandler}
				error={dummyTreeView[0].error}
				isSaving={dummyTreeView[0].saving}
				isApplication
				data="test-data"
				setError={onSetNodeErr()}
				clearError={onSetNodeErr()}
			/>,
		);
		const nodeCancelBtn = getByTestId('node-cancel-btn') as HTMLInputElement;
		fireEvent.click(nodeCancelBtn);
		expect(onToggleEdit).toHaveBeenCalled();
	});
});
