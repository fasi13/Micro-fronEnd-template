import { TreeView } from '../../../types';
import { nodeUpdateState } from '../helpers/hierarchy.store.helper';
import * as utilHelper from '../helpers/util.help';
import { useHierarchyStore } from '../hierarchyState.store';

const selfupdateUrl = 'dummy/selfupdate';
const createGroupUrl = 'dummy/createGroup';
const createAppUrl = 'dummy/createApp';
const childrenAppUrl = 'dummy/children_application';
const childrenAppGroupUrl = 'dummy/children_applicationGroup';
const dummyErrorMsg = 'dummy error';

const dummyTreeView: TreeView[] = [];
dummyTreeView.push({
	id: 1,
	name: 'dummy',
	collapsed: false,
	edit: false,
	error: null,
	saving: false,
	loadingChildren: false,
	toggleNewEditor: '',
	nodeDepth: 0,
	nodePath: [{ pathId: 1, pathName: 'dummy' }],
	_links: [
		{
			href: selfupdateUrl,
			method: { method: 'GET' },
			name: 'updateSelf',
			rel: 'updateApplicationGroup',
		},
		{
			href: selfupdateUrl,
			method: { method: 'GET' },
			name: 'updateSelf',
			rel: 'updateApplication',
		},
		{
			href: createGroupUrl,
			method: { method: 'POST' },
			name: 'createGroup',
			rel: 'createApplicationGroup',
		},
		{
			href: createAppUrl,
			method: { method: 'POST' },
			name: 'createApp',
			rel: 'createApplication',
		},
		{
			href: childrenAppUrl,
			method: { method: 'GET' },
			name: 'getChildren',
			rel: 'applications',
		},
		{
			href: childrenAppGroupUrl,
			method: { method: 'GET' },
			name: 'getChildren',
			rel: 'applicationGroups',
		},
	],
	childrenData: [
		{
			id: 2,
			name: 'dummy-child2',
			collapsed: false,
			edit: false,
			error: null,
			saving: false,
			loadingChildren: false,
			toggleNewEditor: '',
			nodeDepth: 0,
			nodePath: [
				{ pathId: 1, pathName: 'dummy' },
				{ pathId: 2, pathName: 'dummy-child2' },
			],
		},
	],
});
const dummyErrorPayload = {
	title: 'dummyerror',
	status: 500,
	errorCode: 0,
	errors: [dummyErrorMsg],
};

describe('nodeUpdateState', () => {
	beforeEach(() => {
		useHierarchyStore.setState({
			...useHierarchyStore.getState(),
			hierarchyData: dummyTreeView,
			error: null,
		});
	});

	it('modifies node state with children', () => {
		const updateChildrenHandlerSpy = jest.spyOn(
			utilHelper,
			'updateChildrenHandler',
		);

		nodeUpdateState(
			useHierarchyStore.setState,
			dummyTreeView[0].nodePath,
			null,
			[],
		);

		expect(updateChildrenHandlerSpy).toHaveBeenCalled();
		expect(useHierarchyStore.getState().hierarchyData[0].childrenData).toEqual(
			[],
		);
	});

	it('modifies node state with error', () => {
		const nodeErrorHandlerSpy = jest.spyOn(utilHelper, 'nodeErrorHandler');

		nodeUpdateState(
			useHierarchyStore.setState,
			dummyTreeView[0].nodePath,
			dummyErrorPayload,
			[],
		);

		expect(nodeErrorHandlerSpy).toHaveBeenCalled();
		expect(useHierarchyStore.getState().hierarchyData[0].error).toMatch(
			dummyErrorMsg,
		);
	});

	it('will not upadte state if it can not find noe', () => {
		const updateChildrenHandlerSpy = jest.spyOn(
			utilHelper,
			'updateChildrenHandler',
		);

		const nodeErrorHandlerSpy = jest.spyOn(utilHelper, 'nodeErrorHandler');

		nodeUpdateState(
			useHierarchyStore.setState,
			[{ pathId: -9999, pathName: '' }],
			null,
			[],
		);

		expect(updateChildrenHandlerSpy).not.toHaveBeenCalled();
		expect(nodeErrorHandlerSpy).not.toHaveBeenCalled();
	});
});

// describe('updateStateWithUsersApplicationAndGroups', () => {});
