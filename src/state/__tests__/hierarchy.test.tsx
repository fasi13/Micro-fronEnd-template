import { ErrorResponse, TreeView } from '../../types';
import { HierarchyClient as axios } from '../../util/axios';
import * as helper from '../helpers/hierarchy.store.helper';
import { useHierarchyStore } from '../hierarchyState.store';

describe('hieararchy store', () => {
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
				name: 'dummy-child',
				collapsed: false,
				edit: false,
				error: null,
				saving: false,
				loadingChildren: false,
				toggleNewEditor: '',
				nodeDepth: 0,
				nodePath: [{ pathId: 2, pathName: 'dummy-child' }],
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
			},
		],
	});

	beforeEach(() => {
		useHierarchyStore.setState({
			...useHierarchyStore.getState(),
			hierarchyData: dummyTreeView,
			error: null,
		});
	});
	test('hierarchy store is defined', () => {
		expect(useHierarchyStore.getState()).toMatchSnapshot();
	});

	test('setLoading true sets loading state to true', () => {
		useHierarchyStore.getState().setLoading(true);
		expect(useHierarchyStore.getState().loading).toBe(true);
	});

	test('set LoadingChildren sets a specific node loadingChildren state to true when passed true val', () => {
		useHierarchyStore
			.getState()
			.setLoadingChildren([{ pathId: -1, pathName: 'dummy' }], true);

		expect(useHierarchyStore.getState().hierarchyData[0].loadingChildren).toBe(
			true,
		);
	});

	test('set Error sets error value in store', () => {
		useHierarchyStore.getState().setError(dummyErrorMsg);

		expect(useHierarchyStore.getState().error).toBe(dummyErrorMsg);
	});

	describe('initializeHierarhcyState', () => {
		test('initializeHierarhcyState call sets activeNodeId and defaultExpandLevel', () => {
			useHierarchyStore.setState({
				...useHierarchyStore.getState(),
				activeNodeId: -1,
				defaultExpandLevel: -1,
			});

			useHierarchyStore.getState().initializeHierarchyState();

			expect(useHierarchyStore.getState().activeNodeId).toBe(1);
			expect(useHierarchyStore.getState().defaultExpandLevel).toBe(0);
		});

		test('initializeHierarhcyState call with param 1 sets defaultExpandLevel to 1', () => {
			useHierarchyStore.setState({
				...useHierarchyStore.getState(),
				activeNodeId: -1,
				defaultExpandLevel: -1,
			});

			useHierarchyStore.getState().initializeHierarchyState(1);

			expect(useHierarchyStore.getState().activeNodeId).toBe(1);
			expect(useHierarchyStore.getState().defaultExpandLevel).toBe(1);
		});
	});

	describe('loadApplication', () => {
		beforeEach(() => {
			useHierarchyStore.getState().setLoading(true);
		});
		afterEach(() => {
			jest.resetAllMocks();
		});
		it('loads an application by its Id from API', async () => {
			jest
				.spyOn(axios, 'get')
				.mockResolvedValueOnce({
					data: { data: dummyTreeView[0], success: true },
				})
				.mockResolvedValueOnce({
					data: {
						data: {
							items: dummyTreeView,
							limit: 10,
							offset: 5,
							totalCount: 25,
							links: dummyTreeView[0]._links,
						},
					},
				});
			const getChildrenLinkSpy = jest.spyOn(helper, 'getChildrenLink');

			await useHierarchyStore.getState().loadApplication('1');

			expect(axios.get).toHaveBeenCalledWith('applications/1');
			expect(axios.get).toHaveBeenCalledWith('dummy/children_applicationGroup');
			expect(getChildrenLinkSpy).toHaveBeenCalled();

			expect(useHierarchyStore.getState().loading).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData).toMatchObject([
				{
					toggleNewEditor: '',
					error: null,
					saving: false,
					edit: false,
					loadingChildren: false,
					collapsed: false,
					childrenData: dummyTreeView.map(d => ({ ...d, collapsed: true })),
				},
			]);
		});

		it('catches error for invalid application and sets error state', async () => {
			jest.spyOn(axios, 'get').mockRejectedValueOnce({
				title: 'dummyerror',
				status: 500,
				errorCode: 0,
				errors: [dummyErrorMsg],
			});

			await useHierarchyStore.getState().loadApplication('1');

			expect(axios.get).toHaveBeenCalledWith('applications/1');

			expect(useHierarchyStore.getState().error).toBe(dummyErrorMsg);
		});
	});

	describe('toggleCollapse', () => {
		it('if passed true it will collapse the node', async () => {
			useHierarchyStore.setState({
				...useHierarchyStore.getState(),
				hierarchyData: dummyTreeView,
			});
			const nodeToUpdatespy = jest.spyOn(helper, 'getNodeToUpdate');
			await useHierarchyStore
				.getState()
				.toggleCollapse(dummyTreeView[0].nodePath, true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].collapsed).toBe(
				true,
			);
		});

		it('if passed false it will expand node', async () => {
			const nodeToUpdatespy = jest.spyOn(helper, 'getNodeToUpdate');
			const getHierarchyChildDataSpy = jest
				.spyOn(helper, 'getHierarchyChildData')
				.mockResolvedValueOnce({ err: null, children: dummyTreeView });

			await useHierarchyStore
				.getState()
				.toggleCollapse(dummyTreeView[0].nodePath, false);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(getHierarchyChildDataSpy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].collapsed).toBe(
				false,
			);
		});
	});

	describe('toggleEdit', () => {
		it('on toggleEdit it changes edit state and clears any error', async () => {
			const nodeToUpdatespy = jest.spyOn(helper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.toggleEdit(dummyTreeView[0].nodePath, true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].edit).toBe(true);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBeNull();
		});
	});

	describe('toggleNewEditor', () => {
		it('on toggleNewEditor it sets NewEditor Mode Application or Group', async () => {
			const nodeToUpdatespy = jest.spyOn(helper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.toggleNewEditor(dummyTreeView[0].nodePath, 'Application');

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(
				useHierarchyStore.getState().hierarchyData[0].toggleNewEditor,
			).toBe('Application');
			expect(useHierarchyStore.getState().hierarchyData[0].collapsed).toBe(
				false,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBeNull();
		});
	});
	describe('setSaving', () => {
		it('on setSaving a nodes saving is toggled to passed val', async () => {
			const nodeToUpdatespy = jest.spyOn(helper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.setSaving(dummyTreeView[0].nodePath, true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(true);
		});
	});

	describe('setNodeError', () => {
		it('setNodeError accepts string as error', async () => {
			const nodeToUpdatespy = jest.spyOn(helper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.setNodeError(dummyTreeView[0].nodePath, dummyErrorMsg);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].error).toMatch(
				dummyErrorMsg,
			);
		});

		it('setNodeError accepts null as value', async () => {
			const nodeToUpdatespy = jest.spyOn(helper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.setNodeError(dummyTreeView[0].nodePath, null);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBeNull();
		});

		it('setNodeError accepts ErrorResponse as value', async () => {
			const nodeToUpdatespy = jest.spyOn(helper, 'getNodeToUpdate');
			const dummyError: ErrorResponse = {
				errorCode: 0,
				title: 'dummy',
				status: 500,
				errors: ['dummy'],
			};

			await useHierarchyStore
				.getState()
				.setNodeError(dummyTreeView[0].nodePath, dummyError);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].error).toMatch(
				'dummy',
			);
		});
	});

	describe('createApplicationGroup', () => {
		it('');
	});
});
