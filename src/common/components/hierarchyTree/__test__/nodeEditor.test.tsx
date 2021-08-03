import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { useHierarchyStore } from '../../../../state';
import { TreeView } from '../../../../types';
import { NodeEditor } from '../nodeEditor';

describe('hieararchy store', () => {
	let dummyTreeView: TreeView;

	beforeEach(() => {
		dummyTreeView = {
			id: 0,
			name: 'dummy',
			collapsed: false,
			edit: false,
			error: null,
			saving: false,
			loadingChildren: false,
			toggleNewEditor: '',
			nodeDepth: 0,
			nodePath: [{ pathId: -1, pathName: 'dummy' }],
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
		};
	});

	test('node editor input should accept user input', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = jest.fn();

		const { getByTestId } = render(
			<NodeEditor
				key={`node_editor_${dummyTreeView.id}`}
				onClose={() => {
					onToggleEdit(dummyTreeView.nodePath, false);
				}}
				onSubmit={submitHandler}
				error={dummyTreeView.error}
				isSaving={dummyTreeView.saving}
				isApplication
				data="test-data"
				setError={onSetNodeErr()}
				clearError={onSetNodeErr()}
			/>,
		);
		const input = getByTestId('node-editor-input') as HTMLInputElement;
		fireEvent.change(input, {
			target: { value: 'test' },
		});
		expect(input.value).toBe('test');
	});

	// test('node editor form submission should call correct function', () => {
	// 	useHierarchyStore.getState().setLoading(true);
	// 	const onToggleEdit = jest.fn();
	// 	const submitHandler = jest.fn();
	// 	const onSetNodeErr = jest.fn();

	// 	const { getByTestId, debug } = render(
	// 		<NodeEditor
	// 			key={`node_editor_${dummyTreeView.id}`}
	// 			onClose={() => {
	// 				onToggleEdit(dummyTreeView.nodePath, false);
	// 			}}
	// 			onSubmit={submitHandler}
	// 			error={dummyTreeView.error}
	// 			isSaving={dummyTreeView.saving}
	// 			isApplication
	// 			data="test-data"
	// 			setError={onSetNodeErr()}
	// 			clearError={onSetNodeErr()}
	// 		/>,
	// 	);
	// 	debug();
	// 	const form = getByTestId('node-editor-form');
	// 	fireEvent.submit(form);
	// 	expect(submitHandler).toHaveBeenCalled();
	// });

	// test('node editor form submission should call correct function when empty text is provided', () => {
	// 	const onToggleEdit = jest.fn();
	// 	const submitHandler = jest.fn();
	// 	const onSetNodeErr = (val: string | ErrorResponse) =>
	// 		typeof val === 'string'
	// 			? useHierarchyStore.getState().setError(val)
	// 			: useHierarchyStore.getState().setError(val.errors[0]);

	// 	const { getByTestId, debug } = render(
	// 		<NodeEditor
	// 			key={`node_editor_${dummyTreeView.id}`}
	// 			onClose={() => {
	// 				onToggleEdit(dummyTreeView.nodePath, false);
	// 			}}
	// 			onSubmit={submitHandler}
	// 			error={dummyTreeView.error}
	// 			isSaving={dummyTreeView.saving}
	// 			isApplication
	// 			data=""
	// 			setError={onSetNodeErr}
	// 			clearError={() => null}
	// 		/>,
	// 	);
	// 	debug();
	// 	const form = getByTestId('node-editor-form');
	// 	const input = getByTestId('node-editor-input') as HTMLInputElement;
	// 	fireEvent.change(input, {
	// 		target: { value: '' },
	// 	});
	// 	fireEvent.submit(form);
	// 	expect(submitHandler).toHaveBeenCalled();
	// });

	test('node editor cancel button should call correct function', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleEdit = jest.fn();
		const submitHandler = jest.fn();
		const onSetNodeErr = jest.fn();

		const { getByTestId } = render(
			<NodeEditor
				key={`node_editor_${dummyTreeView.id}`}
				onClose={() => {
					onToggleEdit(dummyTreeView.nodePath, false);
				}}
				onSubmit={submitHandler}
				error={dummyTreeView.error}
				isSaving={dummyTreeView.saving}
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
