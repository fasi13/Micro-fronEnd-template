import { Link, TreeView } from '../../../types';
import { HierarchyClient as axios } from '../../../util/axios';
import * as linkHelper from '../helpers/hierarchy.link.helper';
import * as helper from '../helpers/util.help';

const selfupdateUrl = 'dummy/selfupdate';
const createGroupUrl = 'dummy/createGroup';
const createAppUrl = 'dummy/createApp';
const childrenAppUrl = 'dummy/children_application';
const childrenAppGroupUrl = 'dummy/children_applicationGroup';
const dummyErrorMsg = 'dummy error';
const dummyTreeView: TreeView[] = [];
const dummyErrorPayload = {
	title: 'dummyerror',
	status: 500,
	errorCode: 0,
	errors: [dummyErrorMsg],
};
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
			collapsed: true,
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

describe('getNodeToUpdate', () => {
	it('returns node to update based on the passed in nodepath', () => {
		const hierarhcyData: TreeView[] = dummyTreeView;
		const nodePath = [
			{ pathId: 1, pathName: 'dummy' },
			{ pathId: 2, pathName: 'dummy-child' },
		];

		expect(helper.getNodeToUpdate(hierarhcyData, nodePath)).toMatchObject({
			...dummyTreeView[0].childrenData?.[0],
		});
	});

	// it returns undefined if nodeToUpdate is not found
	it('returns undefined if nodeToUpdate is not found', () => {
		const hierarhcyData: TreeView[] = dummyTreeView;
		const nodePath = [
			{ pathId: 1, pathName: 'dummy' },
			{ pathId: 4, pathName: 'dummy-child' }, // wrong pathId here
		];

		expect(helper.getNodeToUpdate(hierarhcyData, nodePath)).toBeUndefined();
	});
});

describe('getHierarchyChildData', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('fetches a nodes children from API and add state props to it', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: {
				data: {
					items: [
						{
							...dummyTreeView[0]?.childrenData[0],
							collapsed: undefined,
							toggleNewEditor: undefined,
							saving: undefined,
							loadingChildren: undefined,
							edit: undefined,
							error: undefined,
						},
					],
				},
			},
			status: 200,
		});

		const p: Link[] | undefined = dummyTreeView[0]._links?.filter(
			l => l.rel === 'applications',
		);

		const getChildrenSpy = jest
			.spyOn(linkHelper, 'getChildrenLink')
			.mockReturnValueOnce(p);

		const result = await helper.getHierarchyChildData({
			...dummyTreeView[0],
			childrenData: undefined,
		});

		expect(getChildrenSpy).toHaveBeenCalled();

		expect(result).toMatchObject({
			err: null,
			children: dummyTreeView[0].childrenData,
		});
	});

	it('will handle error gracefully when loading children', async () => {
		jest.spyOn(axios, 'get').mockRejectedValueOnce({ ...dummyErrorPayload });

		const p: Link[] | undefined = dummyTreeView[0]._links?.filter(
			l => l.rel === 'applications',
		);

		const getChildrenSpy = jest
			.spyOn(linkHelper, 'getChildrenLink')
			.mockReturnValueOnce(p);

		const result = await helper.getHierarchyChildData({
			...dummyTreeView[0],
			childrenData: undefined,
		});

		expect(getChildrenSpy).toHaveBeenCalled();

		expect(result).toMatchObject({
			err: { ...dummyErrorPayload },
			children: [],
		});
	});

	it('will return could not find link error if children link inside node is not found', async () => {
		jest.spyOn(axios, 'get').mockImplementationOnce(() => null);

		const getChildrenSpy = jest
			.spyOn(linkHelper, 'getChildrenLink')
			.mockReturnValueOnce(undefined);

		const result = await helper.getHierarchyChildData({
			...dummyTreeView[0],
			childrenData: undefined,
		});

		expect(getChildrenSpy).toHaveBeenCalled();

		expect(result).toMatchObject({
			err: {
				errors: ['Could not find the link to load children with'],
				status: 0,
				errorCode: 0,
				title: 'unknown error',
			},
			children: [],
		});
	});

	it('will return could not find link error if data.links is undefined', async () => {
		const result = await helper.getHierarchyChildData({
			...dummyTreeView[0],
			_links: undefined,
			childrenData: undefined,
		});

		expect(result).toMatchObject({
			err: {
				errors: ['Could not find the link to load children with'],
				status: 0,
				errorCode: 0,
				title: 'unknown error',
			},
			children: [],
		});
	});

	it('will ignore results that do not have status 200', async () => {
		jest.spyOn(axios, 'get').mockResolvedValueOnce({
			data: {
				data: {
					items: [
						{
							...dummyTreeView[0]?.childrenData[0],
							collapsed: undefined,
							toggleNewEditor: undefined,
							saving: undefined,
							loadingChildren: undefined,
							edit: undefined,
							error: undefined,
						},
					],
				},
			},
			status: 0,
		});

		const p: Link[] | undefined = dummyTreeView[0]._links?.filter(
			l => l.rel === 'applications',
		);

		const getChildrenSpy = jest
			.spyOn(linkHelper, 'getChildrenLink')
			.mockReturnValueOnce(p);

		const result = await helper.getHierarchyChildData({
			...dummyTreeView[0],
			childrenData: undefined,
		});

		expect(getChildrenSpy).toHaveBeenCalled();

		expect(result).toMatchObject({
			err: null,
			children: [],
		});
	});
});

describe('nodeErrorHandler', () => {
	it('modifies a node state to reflect error state', () => {
		const data: TreeView = dummyTreeView[0];
		helper.nodeErrorHandler(
			{ errors: [dummyErrorMsg], errorCode: 0, status: 0, title: '' },
			data,
		);
		expect(data).toMatchObject({
			...data,
			loadingChildren: false,
			error: dummyErrorMsg,
			saving: false,
		});
	});
});

describe('updateChildrenHandler', () => {
	it('updates a node with childrenData and sets other props to default state', () => {
		const data: TreeView = dummyTreeView[0];
		helper.updateChildrenHandler(
			{ ...data, childrenData: undefined },
			dummyTreeView[0].childrenData || [],
		);
		expect(data).toMatchObject({
			...data,
			childrenData: dummyTreeView[0].childrenData,
			loadingChildren: false,
			collapsed: false,
			toggleNewEditor: '',
			saving: false,
		});
	});
});

describe('updateNodeValues', () => {
	it('updates a nodes name and value property', () => {
		const data: TreeView = dummyTreeView[0];
		helper.updateNodeValues(data, 'dummy', 'dummy-v');
		expect(data).toMatchObject({
			...data,
			name: 'dummy',
			value: 'dummy-v',
			saving: false,
			loadingChildren: false,
			toggleNewEditor: '',
			edit: false,
			error: null,
		});
	});
});
