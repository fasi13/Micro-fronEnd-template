import { TreeView } from '../../types';
import { HierarchyClient as axios } from '../../util/axios';
import * as helper from '../helpers/hierarchy.store.helper';
import { useHierarchyStore } from '../hierarchyState.store';

describe('hieararchy store', () => {
	const dummyTreeView: TreeView[] = [];

	beforeEach(() => {
		dummyTreeView.length = 0;
		dummyTreeView.push({
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
		});
	});
	test('hierarchy store is defined', () => {
		expect(useHierarchyStore.getState()).toMatchSnapshot();
	});

	test('set Loading true sets loading state to true', () => {
		useHierarchyStore.getState().setLoading(true);
		expect(useHierarchyStore.getState().loading).toBe(true);
	});

	test('set LoadingChildren sets a specific node loadingChildren state to true when passed true val', () => {
		useHierarchyStore.setState({
			...useHierarchyStore.getState(),
			hierarchyData: dummyTreeView,
		});

		useHierarchyStore
			.getState()
			.setLoadingChildren([{ pathId: -1, pathName: 'dummy' }], true);

		expect(useHierarchyStore.getState().hierarchyData[0].loadingChildren).toBe(
			true,
		);
	});

	test('set Error sets error value in store', () => {
		useHierarchyStore.setState({
			...useHierarchyStore.getState(),
			error: null,
		});

		useHierarchyStore.getState().setError('dummy error');

		expect(useHierarchyStore.getState().error).toBe('dummy error');
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
				errors: ['dummy error text'],
			});

			await useHierarchyStore.getState().loadApplication('1');

			expect(axios.get).toHaveBeenCalledWith('applications/1');

			expect(useHierarchyStore.getState().error).toBe('dummy error text');
		});
	});

	describe('toggleCollapse', () => {
		beforeEach(() => {
			useHierarchyStore.setState({
				...useHierarchyStore.getState(),
				hierarchyData: dummyTreeView,
				loading: true,
			});
		});
		afterEach(() => {
			jest.resetAllMocks();
		});
		it('if collapsed it will toggle it to expand', () => {
			const nodeToUpdatespy = jest.spyOn(helper, 'getNodeToUpdate');

			useHierarchyStore.getState().toggleEdit(dummyTreeView[0].nodePath, true);

			expect(nodeToUpdatespy).toHaveBeenCalledWith(
				useHierarchyStore.getState().hierarchyData,
				dummyTreeView[0].nodePath,
			);
		});

		// it('if expanded it will toggle it to collapsed', () => {

		// })
	});
});
