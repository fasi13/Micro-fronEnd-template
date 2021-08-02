import { ErrorResponse, TreeView } from '../../../types';
import { HierarchyClient as axios } from '../../../util/axios';
import * as linkHelper from '../helpers/hierarchy.link.helper';
import * as storeHelper from '../helpers/hierarchy.store.helper';
import * as utilStateHelper from '../helpers/util.help';
import { useHierarchyStore } from '../hierarchyState.store';

describe('hieararchy store', () => {
	const applicationUrl = 'applications/1';
	const selfupdateUrl = 'dummy/selfupdate';
	const createGroupUrl = 'dummy/createGroup';
	const createAppUrl = 'dummy/createApp';
	const childrenAppUrl = 'dummy/children_application';
	const childrenAppGroupUrl = 'dummy/children_applicationGroup';
	const dummyErrorMsg = 'dummy error';
	const someErrorOccurred = 'some error occurred';
	const dummyErrorPayload = {
		title: 'dummyerror',
		status: 500,
		errorCode: 0,
		errors: [dummyErrorMsg],
	};

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
	it('hierarchy store is defined', () => {
		expect(useHierarchyStore.getState()).toMatchSnapshot();
	});

	it('setLoading true sets loading state to true', () => {
		useHierarchyStore.getState().setLoading(true);
		expect(useHierarchyStore.getState().loading).toBe(true);
	});

	it('set LoadingChildren sets a specific node loadingChildren state to true when passed true val', () => {
		useHierarchyStore
			.getState()
			.setLoadingChildren([{ pathId: 1, pathName: 'dummy' }], true);

		expect(useHierarchyStore.getState().hierarchyData[0].loadingChildren).toBe(
			true,
		);
	});

	it('set Error sets error value in store', () => {
		useHierarchyStore.getState().setError(dummyErrorMsg);

		expect(useHierarchyStore.getState().error).toBe(dummyErrorMsg);
	});

	describe('initializeHierarhcyState', () => {
		it('initializeHierarhcyState call sets activeNodeId and defaultExpandLevel', () => {
			useHierarchyStore.setState({
				...useHierarchyStore.getState(),
				activeNodeId: -1,
				defaultExpandLevel: -1,
			});

			useHierarchyStore.getState().initializeHierarchyState();

			expect(useHierarchyStore.getState().activeNodeId).toBe(1);
			expect(useHierarchyStore.getState().defaultExpandLevel).toBe(0);
		});

		it('initializeHierarhcyState call with param 1 sets defaultExpandLevel to 1', () => {
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
			useHierarchyStore.setState({
				...useHierarchyStore.getState(),
				activeNodeId: 1,
			});
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
			const getChildrenLinkSpy = jest.spyOn(linkHelper, 'getChildrenLink');

			await useHierarchyStore.getState().loadApplication();

			expect(axios.get).toHaveBeenCalledWith(applicationUrl);
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
			jest.spyOn(axios, 'get').mockRejectedValueOnce(dummyErrorPayload);

			await useHierarchyStore.getState().loadApplication();

			expect(axios.get).toHaveBeenCalledWith(applicationUrl);

			expect(useHierarchyStore.getState().error).toBe(dummyErrorMsg);
		});

		it('ignores application response with empty links', async () => {
			jest.spyOn(axios, 'get').mockResolvedValueOnce({
				data: {
					data: { ...dummyTreeView[0], _links: undefined },
					success: true,
				},
			});

			const getChildrenLinkSpy = jest.spyOn(linkHelper, 'getChildrenLink');

			await useHierarchyStore.getState().loadApplication();

			expect(axios.get).toHaveBeenCalledWith(applicationUrl);
			expect(getChildrenLinkSpy).toHaveBeenCalled();

			expect(useHierarchyStore.getState().loading).toBe(false);
		});
	});

	describe('toggleCollapse', () => {
		it('if passed true it will collapse the node', async () => {
			useHierarchyStore.setState({
				...useHierarchyStore.getState(),
				hierarchyData: dummyTreeView,
			});
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');
			await useHierarchyStore
				.getState()
				.toggleCollapse(dummyTreeView[0].nodePath, true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].collapsed).toBe(
				true,
			);
		});

		it('if passed false it will expand node', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');
			const getHierarchyChildDataSpy = jest
				.spyOn(utilStateHelper, 'getHierarchyChildData')
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
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

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
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

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
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.setSaving(dummyTreeView[0].nodePath, true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(true);
		});
	});

	describe('setNodeError', () => {
		it('setNodeError accepts string as error', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.setNodeError(dummyTreeView[0].nodePath, dummyErrorMsg);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].error).toMatch(
				dummyErrorMsg,
			);
		});

		it('setNodeError accepts null as value', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.setNodeError(dummyTreeView[0].nodePath, null);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBeNull();
		});

		it('setNodeError accepts ErrorResponse as value', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');
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
		it('successfully creates application group under node', async () => {
			jest.spyOn(axios, 'post').mockResolvedValueOnce({
				data: { data: dummyTreeView[0], success: true },
				status: 201,
			});
			const getCreateGroupLink = jest.spyOn(linkHelper, 'getCreateGroupLink');
			const getHierarchyChildData = jest
				.spyOn(utilStateHelper, 'getHierarchyChildData')
				.mockImplementationOnce((data: TreeView) =>
					Promise.resolve({ err: null, children: [data] }),
				);

			await useHierarchyStore
				.getState()
				.createApplicationGroup(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'newAppGroup',
				);

			expect(axios.post).toHaveBeenCalledWith(createGroupUrl, {
				name: 'newAppGroup',
			});

			expect(getCreateGroupLink).toHaveBeenCalled();
			expect(getHierarchyChildData).toHaveBeenCalled();
			expect(
				useHierarchyStore.getState().hierarchyData[0].childrenData,
			).toMatchObject([{ ...dummyTreeView[0] }]);
		});

		it('handles create application group remote error', async () => {
			jest.spyOn(axios, 'post').mockRejectedValueOnce(dummyErrorPayload);
			const getCreateGroupLink = jest.spyOn(linkHelper, 'getCreateGroupLink');
			const nodeUpdateState = jest.spyOn(storeHelper, 'nodeUpdateState');

			await useHierarchyStore
				.getState()
				.createApplicationGroup(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'newAppGroup',
				);

			expect(axios.post).toHaveBeenCalledWith(createGroupUrl, {
				name: 'newAppGroup',
			});

			expect(getCreateGroupLink).toHaveBeenCalled();
			expect(nodeUpdateState).toHaveBeenCalled();
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
				dummyErrorMsg,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
		});

		it('handles anything other than response.status 201 as unknown error', async () => {
			jest.spyOn(axios, 'post').mockResolvedValueOnce({
				data: { data: dummyTreeView[0], error: null, success: true },
				status: 300,
			});
			const getCreateGroupLink = jest.spyOn(linkHelper, 'getCreateGroupLink');
			const nodeUpdateState = jest.spyOn(storeHelper, 'nodeUpdateState');

			await useHierarchyStore
				.getState()
				.createApplicationGroup(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'newAppGroup',
				);

			expect(getCreateGroupLink).toHaveBeenCalled();
			expect(nodeUpdateState).toHaveBeenCalled();

			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
				someErrorOccurred,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
		});

		it('ignores applicationGroups that do not have createGroupLink link', async () => {
			const getCreateGroupLink = jest
				.spyOn(linkHelper, 'getCreateGroupLink')
				.mockImplementationOnce(() => undefined);

			await useHierarchyStore
				.getState()
				.createApplicationGroup(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'newAppGroup',
				);

			expect(getCreateGroupLink).toHaveBeenCalled();
		});
	});

	describe('editApplicationGroup', () => {
		it('successfully edits application group', async () => {
			jest.spyOn(axios, 'put').mockResolvedValueOnce({
				data: { data: dummyTreeView[0], error: null, success: true },
				status: 200,
			});
			const getSelfUpdateLink = jest.spyOn(linkHelper, 'getSelfUpdateLink');
			const getNodeToUpdate = jest.spyOn(utilStateHelper, 'getNodeToUpdate');
			const updateNodeValues = jest.spyOn(utilStateHelper, 'updateNodeValues');

			await useHierarchyStore
				.getState()
				.editApplicationGroup(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'editAppGroup',
				);

			expect(getSelfUpdateLink).toHaveBeenCalled();
			expect(getNodeToUpdate).toHaveBeenCalled();
			expect(updateNodeValues).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].name).toMatch(
				'editAppGroup',
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
			expect(
				useHierarchyStore.getState().hierarchyData[0].toggleNewEditor,
			).toBe('');
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].edit).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(null);
		});

		it('handles editapplicationgroup remote error', async () => {
			jest.spyOn(axios, 'put').mockRejectedValue(dummyErrorPayload);
			const getSelfUpdateLink = jest.spyOn(linkHelper, 'getSelfUpdateLink');
			const nodeUpdateState = jest.spyOn(storeHelper, 'nodeUpdateState');

			await useHierarchyStore
				.getState()
				.editApplicationGroup(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'editAppGroup',
				);

			expect(getSelfUpdateLink).toHaveBeenCalled();
			expect(nodeUpdateState).toHaveBeenCalled();

			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
				dummyErrorMsg,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
		});

		it('handles anything other than response.status 200 as unknown error', async () => {
			jest.spyOn(axios, 'put').mockResolvedValueOnce({
				data: { data: dummyTreeView[0], error: null, success: true },
				status: 300,
			});
			const getSelfUpdateLink = jest.spyOn(linkHelper, 'getSelfUpdateLink');
			const nodeUpdateState = jest.spyOn(storeHelper, 'nodeUpdateState');

			await useHierarchyStore
				.getState()
				.editApplicationGroup(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'editAppGroup',
				);

			expect(getSelfUpdateLink).toHaveBeenCalled();
			expect(nodeUpdateState).toHaveBeenCalled();

			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
				someErrorOccurred,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
		});

		it('ignores applicationGroups that do not have selfupdate link', async () => {
			const getChildrenLinkSpy = jest.spyOn(linkHelper, 'getSelfUpdateLink');

			await useHierarchyStore
				.getState()
				.editApplicationGroup(
					{ ...dummyTreeView[0], _links: undefined },
					dummyTreeView[0].nodePath,
					'dummyname',
				);

			expect(getChildrenLinkSpy).toHaveBeenCalled();
		});
	});

	describe('createApplication', () => {
		it('successfully creates application', async () => {
			jest.spyOn(axios, 'post').mockResolvedValueOnce({
				data: { data: dummyTreeView[0], success: true },
				status: 201,
			});
			const getCreateApplicationLink = jest.spyOn(
				linkHelper,
				'getCreateApplicationLink',
			);
			const getHierarchyChildData = jest
				.spyOn(utilStateHelper, 'getHierarchyChildData')
				.mockImplementationOnce((data: TreeView) =>
					Promise.resolve({ err: null, children: [data] }),
				);

			await useHierarchyStore
				.getState()
				.createApplication(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'newApp',
					'newValue',
				);

			expect(axios.post).toHaveBeenCalledWith(createAppUrl, {
				name: 'newApp',
				value: 'newValue',
			});

			expect(getCreateApplicationLink).toHaveBeenCalled();
			expect(getHierarchyChildData).toHaveBeenCalled();
			expect(
				useHierarchyStore.getState().hierarchyData[0].childrenData,
			).toMatchObject([{ ...dummyTreeView[0] }]);
		});

		it('handles createApplication remote error', async () => {
			jest.spyOn(axios, 'post').mockRejectedValue(dummyErrorPayload);
			const getCreateApplicationLink = jest.spyOn(
				linkHelper,
				'getCreateApplicationLink',
			);
			const nodeUpdateState = jest.spyOn(storeHelper, 'nodeUpdateState');

			await useHierarchyStore
				.getState()
				.createApplication(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'newApp',
					'newValue',
				);

			expect(getCreateApplicationLink).toHaveBeenCalled();
			expect(nodeUpdateState).toHaveBeenCalled();

			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
				dummyErrorMsg,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
		});

		it('handles anything other than response.status 201 as unknown error', async () => {
			jest.spyOn(axios, 'post').mockResolvedValueOnce({
				data: { data: dummyTreeView[0], error: null, success: true },
				status: 300,
			});
			const getCreateApplicationLink = jest.spyOn(
				linkHelper,
				'getCreateApplicationLink',
			);
			const nodeUpdateState = jest.spyOn(storeHelper, 'nodeUpdateState');

			await useHierarchyStore
				.getState()
				.createApplication(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'newApp',
					'newValue',
				);

			expect(getCreateApplicationLink).toHaveBeenCalled();
			expect(nodeUpdateState).toHaveBeenCalled();

			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
				someErrorOccurred,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
		});

		it('ignores application that do not have createApplication link', async () => {
			const getCreateApplicationLinkSpy = jest.spyOn(
				linkHelper,
				'getCreateApplicationLink',
			);

			await useHierarchyStore
				.getState()
				.createApplication(
					{ ...dummyTreeView[0], _links: undefined },
					dummyTreeView[0].nodePath,
					'dummyname',
					'dummyValue',
				);

			expect(getCreateApplicationLinkSpy).toHaveBeenCalled();
		});
	});

	describe('editApplication', () => {
		it('successfully edits application detail', async () => {
			jest.spyOn(axios, 'put').mockResolvedValueOnce({
				data: { data: dummyTreeView[0], error: null, success: true },
				status: 200,
			});
			const getSelfUpdateLink = jest.spyOn(linkHelper, 'getSelfUpdateLink');
			const getNodeToUpdate = jest.spyOn(utilStateHelper, 'getNodeToUpdate');
			const updateNodeValues = jest.spyOn(utilStateHelper, 'updateNodeValues');

			await useHierarchyStore
				.getState()
				.editApplication(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'editApp',
					'editValue',
				);

			expect(getSelfUpdateLink).toHaveBeenCalled();
			expect(getNodeToUpdate).toHaveBeenCalled();
			expect(updateNodeValues).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].name).toMatch(
				'editApp',
			);
			expect(useHierarchyStore.getState().hierarchyData[0].value).toMatch(
				'editValue',
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
			expect(
				useHierarchyStore.getState().hierarchyData[0].toggleNewEditor,
			).toBe('');
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].edit).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(null);
		});

		it('handles editapplication remote error', async () => {
			jest.spyOn(axios, 'put').mockRejectedValue(dummyErrorPayload);
			const getSelfUpdateLink = jest.spyOn(linkHelper, 'getSelfUpdateLink');
			const nodeUpdateState = jest.spyOn(storeHelper, 'nodeUpdateState');

			await useHierarchyStore
				.getState()
				.editApplication(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'editApp',
					'editValue',
				);

			expect(getSelfUpdateLink).toHaveBeenCalled();
			expect(nodeUpdateState).toHaveBeenCalled();

			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
				dummyErrorMsg,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
		});

		it('handles anything other than response.status 200 as unknown error', async () => {
			jest.spyOn(axios, 'put').mockResolvedValueOnce({
				data: { data: dummyTreeView[0], error: null, success: true },
				status: 300,
			});
			const getSelfUpdateLink = jest.spyOn(linkHelper, 'getSelfUpdateLink');
			const nodeUpdateState = jest.spyOn(storeHelper, 'nodeUpdateState');

			await useHierarchyStore
				.getState()
				.editApplication(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'editApp',
					'editValue',
				);

			expect(getSelfUpdateLink).toHaveBeenCalled();
			expect(nodeUpdateState).toHaveBeenCalled();

			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
			expect(
				useHierarchyStore.getState().hierarchyData[0].loadingChildren,
			).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBe(
				someErrorOccurred,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
		});

		it('ignores application that do not have editApplication link', async () => {
			const getSelfUpdateLink = jest.spyOn(linkHelper, 'getSelfUpdateLink');

			await useHierarchyStore
				.getState()
				.editApplication(
					dummyTreeView[0],
					dummyTreeView[0].nodePath,
					'editApp',
					'editValue',
				);

			expect(getSelfUpdateLink).toHaveBeenCalled();
		});
	});
});
