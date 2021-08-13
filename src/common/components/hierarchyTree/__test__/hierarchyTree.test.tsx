/* eslint-disable react/jsx-props-no-spreading */
import { render } from '@testing-library/react';
import React from 'react';
import { TreeView } from '../../../../types';
import { HierarchyPropType, HierarchyTree } from '../hierarchyTree';

describe('treeNode', () => {
	let dummyProps: HierarchyPropType;
	let dummyTreeView: TreeView[];
	const selfUpdateStr = 'dummy/selfupdate';
	const createGroupStr = 'dummy/createGroup';
	const createAppStr = 'dummy/createApp';

	beforeEach(() => {
		dummyTreeView = [
			{
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
			},
		];
		dummyProps = {
			data: dummyTreeView,
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

	it('renders hierarchyTree component', () => {
		expect(render(<HierarchyTree {...dummyProps} />)).toMatchSnapshot();
	});
});
