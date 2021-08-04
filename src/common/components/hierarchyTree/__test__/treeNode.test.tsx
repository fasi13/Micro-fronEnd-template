/* eslint-disable react/jsx-props-no-spreading */
import { render } from '@testing-library/react';
import React from 'react';
import { TreeView } from '../../../../types';
import { TreeNode, TreeNodePropType } from '../treeNode';

describe('treeNode', () => {
	let dummyProps: TreeNodePropType;
	let dummyTreeView: TreeView;
	const selfUpdateStr = 'dummy/selfupdate';
	const createGroupStr = 'dummy/createGroup';
	const createAppStr = 'dummy/createApp';

	beforeEach(() => {
		dummyTreeView = {
			id: 0,
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
		dummyProps = {
			data: { ...dummyTreeView },
			nodeId: dummyTreeView.id,
			nodePath: dummyTreeView.nodePath,
			renderProps: jest.fn(),
			onToggleCollapse: jest.fn(),
			onToggleNewEditor: jest.fn(),
			onToggleEdit: jest.fn(),
			onSetSaving: jest.fn(),
			onSetNodeErr: jest.fn(),
			onAddApplication: jest.fn(),
			onEditApplication: jest.fn(),
			onAddGroup: jest.fn(),
			onEditGroup: jest.fn(),
		};
	});

	it('renders treeNode component', () => {
		expect(render(<TreeNode {...dummyProps} />)).toMatchSnapshot();
	});

	it('it adds a margin bottom of 10 to container if data has error in edit mode', () => {
		dummyProps.data.edit = true;
		dummyProps.data.error = 'error';
		// eslint-disable-next-line react/jsx-props-no-spreading
		const { getByTestId } = render(<TreeNode {...dummyProps} />);

		expect(getByTestId('treeitem')).toHaveClass('mb-10');
	});

	it('shows nodeEditor component if data.edit is truthy', () => {
		dummyProps.data.edit = true;
		dummyProps.data.collapsed = false;

		const renderPropsSpy = jest.spyOn(dummyProps, 'renderProps');
		const { getByTestId } = render(<TreeNode {...dummyProps} />);

		expect(getByTestId('node-editor-component')).toBeTruthy();
		// eslint-disable-next-line sonarjs/no-duplicate-string
		expect(getByTestId('tree-item-children')).toBeTruthy();
		expect(renderPropsSpy).toHaveBeenCalled();
	});

	it('shows node component if data.edit is falsy', () => {
		dummyProps.data.edit = false;
		dummyProps.data.collapsed = false;

		const renderPropsSpy = jest.spyOn(dummyProps, 'renderProps');
		const { getByTestId } = render(<TreeNode {...dummyProps} />);

		expect(getByTestId('node-component')).toBeTruthy();
		expect(getByTestId('tree-item-children')).toBeTruthy();
		expect(renderPropsSpy).toHaveBeenCalled();
	});

	it('it shows children without new editor if data.editorMode is falsy and data.toggleNewEditor is empty', () => {
		dummyProps.data.toggleNewEditor = '';
		dummyProps.data.collapsed = false;
		const renderPropsSpy = jest.spyOn(dummyProps, 'renderProps');

		const { container, queryByTestId } = render(<TreeNode {...dummyProps} />);

		expect(container.classList).toMatchObject({});
		// eslint-disable-next-line sonarjs/no-duplicate-string
		expect(queryByTestId('new-node-editor')).toBeNull();
		expect(renderPropsSpy).toHaveBeenCalled();
	});

	it('it shows new editor with children if data.editorMode is falsy and data.toggleNewEditor is not empty', () => {
		dummyProps.data.toggleNewEditor = 'Application';
		dummyProps.data.collapsed = false;

		const renderPropsSpy = jest.spyOn(dummyProps, 'renderProps');
		const { getByTestId } = render(<TreeNode {...dummyProps} />);

		expect(getByTestId('tree-item-children')).toHaveClass('mb-10');
		expect(getByTestId('new-node-editor')).toBeTruthy();
		expect(renderPropsSpy).toHaveBeenCalled();
	});

	it('dose not show children and new node if data.collapse is true', () => {
		dummyProps.data.toggleNewEditor = '';
		dummyProps.data.collapsed = true;

		const { queryByTestId } = render(<TreeNode {...dummyProps} />);

		expect(queryByTestId('tree-item-children')).toHaveClass('hidden');
		expect(queryByTestId('new-node-editor')).toBeFalsy();
	});

	// it('yehualashet', () => {
	// 	dummyProps.data.edit = true;
	// 	dummyProps.data.collapsed = false;

	// 	// const renderPropsSpy = jest.spyOn(dummyProps, 'renderProps');
	// 	const objPP = renderer.create(<TreeNode {...dummyProps} />);

	// 	console.log(objPP.toJSON()?.[0].children);
	// 	expect(true).toBe(true);

	// 	// expect(getByTestId('node-editor-component')).toBeTruthy();
	// 	// expect(getByTestId('tree-item-children')).toBeTruthy();
	// 	// expect(renderPropsSpy).toHaveBeenCalled();
	// });
});
