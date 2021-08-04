import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { useHierarchyStore } from '../../../../state/hierarchyStore/hierarchyState.store';
import { TreeView } from '../../../../types';
import { Node, trim } from '../node';

const selfUpdateStr = 'dummy/selfupdate';
const createGroupStr = 'dummy/createGroup';
const createAppStr = 'dummy/createApp';
const nodeLabelsStr = 'node-labels';
const nodeAddAppGroupStr = 'node-add-app-group';

describe('hieararchy store', () => {
	let dummyTreeView: TreeView;
	let dummyTreeView2: TreeView;

	beforeEach(() => {
		dummyTreeView = {
			id: 0,
			value: 'dummy (12)',
			name: 'dummy (12)',
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
					href: selfUpdateStr,
					method: { method: 'GET' },
					name: 'updateSelf',
					rel: 'updateApplicationGroup',
				},
				{
					href: selfUpdateStr,
					method: { method: 'GET' },
					name: 'updateSelf',
					rel: 'updateApplication',
				},

				{
					href: createGroupStr,
					method: { method: 'POST' },
					name: 'createGroup',
					rel: 'createApplicationGroup',
				},
				{
					href: createGroupStr,
					method: { method: 'POST' },
					name: 'createGroup',
					rel: '',
				},
				{
					href: createAppStr,
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
		dummyTreeView2 = {
			id: 0,
			name: '',
			collapsed: true,
			edit: false,
			error: null,
			saving: false,
			loadingChildren: false,
			toggleNewEditor: '',
			nodeDepth: 0,
			nodePath: [{ pathId: -1, pathName: 'dummy' }],
			_links: [
				{
					href: selfUpdateStr,
					method: { method: 'GET' },
					name: 'updateSelf',
					rel: 'updateApplicationGroup',
				},
				{
					href: selfUpdateStr,
					method: { method: 'GET' },
					name: 'updateSelf',
					rel: 'updateApplication',
				},

				{
					href: createGroupStr,
					method: { method: 'POST' },
					name: 'createGroup',
					rel: '',
				},
				{
					href: createAppStr,
					method: { method: 'POST' },
					name: 'createApp',
					rel: 'createApplication',
				},
				{
					href: createGroupStr,
					method: { method: 'POST' },
					name: 'createGroup',
					rel: '',
				},
				{
					href: createAppStr,
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

	test('set Loading true sets should display loading icon', () => {
		useHierarchyStore.getState().setLoading(true);
		const onToggleNewEditor = jest.fn();
		const toggleNewEditor = jest.fn();
		const toggleChildren = jest.fn();

		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView.id}`}
				data={dummyTreeView}
				nodePath={dummyTreeView.nodePath}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={() => onToggleNewEditor}
				toggleNewEditor={() => toggleNewEditor}
				toggleChildren={() => toggleChildren}
			/>,
		);
		expect(getByTestId('loading-indicator')).toBeInTheDocument();
	});

	test('set Loading false should display node container', () => {
		useHierarchyStore.getState().setLoading(false);
		const onToggleNewEditor = jest.fn();
		const toggleNewEditor = jest.fn();
		const toggleChildren = jest.fn();

		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView.id}`}
				data={dummyTreeView}
				nodePath={dummyTreeView.nodePath}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={() => onToggleNewEditor}
				toggleNewEditor={() => toggleNewEditor}
				toggleChildren={() => toggleChildren}
			/>,
		);
		expect(getByTestId('node-container')).toBeInTheDocument();
	});

	test('clicking on node-container should call toggleChildren', () => {
		useHierarchyStore.getState().setLoading(false);
		const onToggleNewEditor = jest.fn();
		const toggleNewEditor = jest.fn();
		const toggleChildren2 = jest.fn();

		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView.id}`}
				data={dummyTreeView}
				nodePath={dummyTreeView.nodePath}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={() => onToggleNewEditor}
				toggleNewEditor={() => toggleNewEditor}
				toggleChildren={toggleChildren2}
			/>,
		);
		fireEvent.click(getByTestId('node-container'));
		expect(toggleChildren2).toHaveBeenCalled();
	});

	test('clicking on node-add-app should call toggleChildren', () => {
		useHierarchyStore.getState().setLoading(false);
		const onToggleNewEditor = jest.fn();
		const toggleNewEditor2 = jest.fn();
		const toggleChildren = jest.fn();

		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView.id}`}
				data={dummyTreeView}
				nodePath={dummyTreeView.nodePath}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={onToggleNewEditor}
				toggleNewEditor={toggleNewEditor2}
				toggleChildren={toggleChildren}
			/>,
		);
		fireEvent.click(getByTestId('node-add-app'));
		expect(toggleNewEditor2).toHaveBeenCalled();
	});

	test('clicking on node-add-app-group should call toggleChildren if data is provided by value', () => {
		useHierarchyStore.getState().setLoading(false);
		const onToggleNewEditor = jest.fn();
		const toggleChildren = jest.fn();
		const toggleNewEditor = jest.fn();

		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView.id}`}
				data={dummyTreeView}
				nodePath={dummyTreeView.nodePath}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={onToggleNewEditor}
				toggleNewEditor={toggleNewEditor}
				toggleChildren={toggleChildren}
			/>,
		);
		expect(getByTestId(nodeLabelsStr)).toHaveTextContent(/(12)/i);
		fireEvent.click(getByTestId(nodeAddAppGroupStr));
		expect(toggleNewEditor).toHaveBeenCalled();
		expect(toggleNewEditor).toHaveBeenCalled();
	});

	test('clicking on node-add-app-group should call toggleChildren if data is provided without value', () => {
		useHierarchyStore.getState().setLoading(false);
		const onToggleNewEditor = jest.fn();
		const toggleChildren = jest.fn();
		const toggleNewEditor = jest.fn();
		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView2.id}`}
				data={dummyTreeView2}
				nodePath={dummyTreeView2.nodePath}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={onToggleNewEditor}
				toggleNewEditor={toggleNewEditor}
				toggleChildren={toggleChildren}
			/>,
		);
		expect(getByTestId(nodeLabelsStr)).not.toHaveTextContent('(12)');
		fireEvent.click(getByTestId(nodeAddAppGroupStr));
		expect(toggleNewEditor).toHaveBeenCalled();
		expect(toggleNewEditor).toHaveBeenCalled();
	});
	test('clicking on node-add-app-group should call toggleChildren ', () => {
		useHierarchyStore.getState().setLoading(false);
		const onToggleNewEditor = jest.fn();
		const toggleChildren = jest.fn();
		const toggleNewEditor = jest.fn();
		// (val: TEditor) => useHierarchyStore.getState().toggleNewEditor(dummyTreeView.nodePath, val);

		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView2.id}`}
				data={dummyTreeView2}
				nodePath={dummyTreeView2.nodePath}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={onToggleNewEditor}
				toggleNewEditor={toggleNewEditor}
				toggleChildren={toggleChildren}
			/>,
		);

		fireEvent.click(getByTestId(nodeAddAppGroupStr));
		expect(toggleNewEditor).toHaveBeenCalled();
	});

	test('clicking on node-labels should call toggleNewEditor', () => {
		useHierarchyStore.getState().setLoading(false);
		const onToggleNewEditor = jest.fn();
		const toggleNewEditor2 = jest.fn();
		const toggleChildren = jest.fn();

		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView.id}`}
				data={dummyTreeView}
				nodePath={dummyTreeView.nodePath}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={() => onToggleNewEditor}
				toggleNewEditor={toggleNewEditor2('Application')}
				toggleChildren={toggleChildren}
			/>,
		);
		fireEvent.click(getByTestId('node-labels'));
		expect(toggleNewEditor2).toHaveBeenCalled();
	});

	test('clicking on node-edit should call toggleNewEditor', () => {
		useHierarchyStore.getState().setLoading(false);
		const onToggleNewEditor2 = jest.fn();
		const toggleNewEditor2 = jest.fn();
		const toggleChildren = jest.fn();

		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView.id}`}
				data={dummyTreeView}
				nodePath={dummyTreeView.nodePath}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={onToggleNewEditor2}
				toggleNewEditor={toggleNewEditor2('Application')}
				toggleChildren={toggleChildren}
			/>,
		);
		fireEvent.click(getByTestId('node-edit'));
		expect(onToggleNewEditor2).toHaveBeenCalled();
	});

	test('is string () included ', () => {
		expect(trim(dummyTreeView)).toBe('(dummy (12))');
		dummyTreeView.value = '';
		expect(trim(dummyTreeView)).toBe('');
	});
});
