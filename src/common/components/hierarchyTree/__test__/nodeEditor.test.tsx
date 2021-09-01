import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useHierarchyStore } from '../../../../state';
import { ErrorResponse, TreeView } from '../../../../types';
import { TUseNodeEditorProps, useNodeEditor } from '../hooks/useNodeEditor';
import { NodeEditor } from '../nodeEditor';

const nodeCancelBtnStr = 'node-cancel-btn';
const nodeEditorInputStr = 'node-editor-input';

describe('nodeEditor', () => {
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
		expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
			'Value can not be empty',
		);
	});

	test('node editor should clear error message if the input is correct', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = (val: string | ErrorResponse) => {
			useHierarchyStore.getState().setNodeError(dummyTreeView[0].nodePath, val);
		};

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
		expect(useHierarchyStore.getState().hierarchyData[0].error).toBe('');
	});

	test('node editor should display spinner icon when isSaving is true', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = (val: string | ErrorResponse) => {
			useHierarchyStore.getState().setNodeError(dummyTreeView[0].nodePath, val);
		};

		const { getByTestId } = render(
			<NodeEditor
				key={`node_editor_${dummyTreeView[0].id}`}
				onClose={() => {
					onToggleEdit(dummyTreeView[0].nodePath, false);
				}}
				onSubmit={submitHandler}
				error={dummyTreeView[0].error}
				isSaving
				isApplication
				data=""
				setError={val => {
					onSetNodeErr(val);
				}}
				clearError={() => onSetNodeErr('')}
			/>,
		);
		const cancelBtn = getByTestId(nodeCancelBtnStr) as HTMLInputElement;
		userEvent.type(cancelBtn, '{enter}');
		expect(getByTestId('spinner-icon')).toBeInTheDocument();
	});

	test('node editor should display spinner icon when isSaving is true', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = (val: string | ErrorResponse) => {
			useHierarchyStore.getState().setNodeError(dummyTreeView[0].nodePath, val);
		};

		const { getByTestId } = render(
			<NodeEditor
				key={`node_editor_${dummyTreeView[0].id}`}
				onClose={() => {
					onToggleEdit(dummyTreeView[0].nodePath, false);
				}}
				onSubmit={submitHandler}
				error={dummyTreeView[0].error}
				isSaving={false}
				isApplication
				data=""
				setError={val => {
					onSetNodeErr(val);
				}}
				clearError={() => onSetNodeErr('')}
			/>,
		);
		const cancelBtn = getByTestId(nodeCancelBtnStr) as HTMLInputElement;
		userEvent.type(cancelBtn, '{enter}');
		expect(getByTestId('close-icon')).toBeInTheDocument();
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
		const nodeCancelBtn = getByTestId(nodeCancelBtnStr) as HTMLInputElement;
		fireEvent.click(nodeCancelBtn);
		expect(onToggleEdit).toHaveBeenCalled();
	});

	it('focuses the controller referenced by inputRef', () => {
		const props: TUseNodeEditorProps = {
			clearError: jest.fn(),
			data: '',
			error: null,
			isApplication: false,
			isSaving: false,
			onSubmit: jest.fn(),
			setError: jest.fn(),
		};

		const RefInit = {
			current: {
				focus: jest.fn(),
			},
		} as unknown as React.RefObject<HTMLInputElement>;

		const { result } = renderHook(useNodeEditor, { initialProps: props });
		const spy = jest.spyOn(result.current, 'focusOnEditor');
		result.current.focusOnEditor(RefInit);
		expect(spy).toHaveBeenCalled();
	});
});
