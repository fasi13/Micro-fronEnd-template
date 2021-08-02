import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { useHierarchyStore } from '../../../../state/hierarchyStore/hierarchyState.store';
import { TreeView } from '../../../../types';
import { Node } from '../node';

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
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={onToggleNewEditor}
				toggleNewEditor={toggleNewEditor2}
				toggleChildren={toggleChildren}
			/>,
		);
		fireEvent.click(getByTestId('node-add-app'));
		expect(toggleNewEditor2).toHaveBeenCalled();
	});

	test('clicking on node-add-app-group should call toggleChildren', () => {
		useHierarchyStore.getState().setLoading(false);
		const onToggleNewEditor = jest.fn();
		const toggleNewEditor2 = jest.fn();
		const toggleChildren = jest.fn();

		const { getByTestId } = render(
			<Node
				key={`node_${dummyTreeView.id}`}
				data={dummyTreeView}
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={onToggleNewEditor}
				toggleNewEditor={toggleNewEditor2}
				toggleChildren={toggleChildren}
			/>,
		);
		fireEvent.click(getByTestId('node-add-app-group'));
		expect(toggleNewEditor2).toHaveBeenCalled();
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
				isLoadingChildren={useHierarchyStore.getState().loading}
				editNode={onToggleNewEditor2}
				toggleNewEditor={toggleNewEditor2('Application')}
				toggleChildren={toggleChildren}
			/>,
		);
		fireEvent.click(getByTestId('node-edit'));
		expect(onToggleNewEditor2).toHaveBeenCalled();
	});
});
