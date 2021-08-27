import { act } from '@testing-library/react';
import { ErrorResponse, TreeView } from '../../../types';
import {
	ContentDeliveryClient,
	HierarchyClient as axios,
} from '../../../util/axios';
import * as linkHelper from '../helpers/hierarchy.link.helper';
import * as storeHelper from '../helpers/hierarchy.store.helper';
import * as utilStateHelper from '../helpers/util.help';
import { useHierarchyStore } from '../hierarchyState.store';

jest.mock('../../../util/setupConfig.ts');
describe('hierarchy store', () => {
	const applicationUrl = 'applications/1';
	const selfupdateUrl = 'dummy/selfupdate';
	const createGroupUrl = 'dummy/createGroup';
	const createAppUrl = 'dummy/createApp';
	const childrenAppUrl = 'dummy/children_application';
	const childrenAppGroupUrl = 'dummy/children_applicationGroup';
	const dummyErrorMsg = 'dummy-error-dummy-error';
	const someErrorOccurred = 'some error occurred';
	const dummyErrorPayload = {
		title: 'dummyerror',
		status: 500,
		errorCode: 0,
		errors: [dummyErrorMsg],
	};

	const dummyTreeView: TreeView[] = [];
	dummyTreeView.push({
		key: 'ds-sd-e43-545-2323-545df-df43435-c04',
		id: 1,
		name: 'dummy',
		collapsed: false,
		edit: false,
		// eslint-disable-next-line sonarjs/no-duplicate-string
		error: 'dummy error',
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

	const dummyErrorResponse = {
		success: true,
		data: {
			items: [
				{
					name: 'Primary Logo dummy',
					description: 'Descscription',
					displayAsList: false,
					status: 'Published',
					value:
						'https://qa-assets-delivery.cxsrecognize.com/Applications/dc91a61c-5ab0-e711-8b81-005056b80f19/JPEG_example_flower.jpeg',
					publishDate: '2021-07-09T06:02:44.4479464',
					dataType: {
						name: 'Image',
						isStructuredType: false,
						type: 'File',
						_links: [],
					},
					version: 28,
					inherited: false,
					dataTypeName: 'Image',
					cultureCode: 'en-US',
					id: 3,
				},
			],
			offset: 0,
			limit: 25,
			totalCount: 1,
			_links: [],
		},
	};
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

	it('set LoadingChildren will not update state if nodeToUpdate is not found', () => {
		useHierarchyStore
			.getState()
			.setLoadingChildren([{ pathId: -1, pathName: 'dummy' }], true);

		expect(useHierarchyStore.getState().hierarchyData[0].loadingChildren).toBe(
			false,
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
			jest.clearAllMocks();
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
			expect(axios.get).toHaveBeenCalledWith(childrenAppGroupUrl);
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
			jest.spyOn(axios, 'get').mockImplementationOnce(() =>
				Promise.resolve({
					data: {
						data: { ...dummyTreeView[0], _links: undefined },
						success: true,
					},
				}),
			);
			jest
				.spyOn(useHierarchyStore.getState(), 'getPrimaryLogo')
				.mockImplementationOnce(() => undefined);

			const getChildrenLinkSpy = jest.spyOn(linkHelper, 'getChildrenLink');

			await useHierarchyStore.getState().loadApplication();

			expect(axios.get).toHaveBeenCalledTimes(1);

			expect(axios.get).toHaveBeenCalledWith(applicationUrl);
			expect(getChildrenLinkSpy).toHaveBeenCalled();

			expect(useHierarchyStore.getState().loading).toBe(false);
		});

		it('ignores modifying state if resGroup is falsy', async () => {
			jest
				.spyOn(axios, 'get')
				.mockImplementationOnce(() =>
					Promise.resolve({
						data: { data: dummyTreeView[0], success: true },
					}),
				)
				.mockImplementationOnce(() => Promise.resolve(undefined));

			const getChildrenLinkSpy = jest.spyOn(linkHelper, 'getChildrenLink');
			jest
				.spyOn(useHierarchyStore.getState(), 'getPrimaryLogo')
				.mockImplementationOnce(() => undefined);

			await useHierarchyStore.getState().loadApplication();

			expect(axios.get).toHaveBeenCalledWith(applicationUrl);
			expect(axios.get).toHaveBeenCalledWith(childrenAppGroupUrl);
			expect(getChildrenLinkSpy).toHaveBeenCalled();
			expect(axios.get).toHaveBeenCalledTimes(2);

			expect(useHierarchyStore.getState().loading).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData).toMatchObject([
				...dummyTreeView,
			]);
		});
	});

	describe('toggleCollapse', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});
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
			const branding = jest
				.spyOn(useHierarchyStore.getState(), 'getPrimaryLogo')
				.mockImplementationOnce(() => undefined);
			const getHierarchyChildDataSpy = jest
				.spyOn(utilStateHelper, 'getHierarchyChildData')
				.mockResolvedValueOnce({ err: null, children: dummyTreeView });

			await useHierarchyStore
				.getState()
				.toggleCollapse(dummyTreeView[0].nodePath, false);
			expect(branding).toHaveBeenCalled();
			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(getHierarchyChildDataSpy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].collapsed).toBe(
				false,
			);
		});

		it('if passed true and unable to find node to update state will not change', async () => {
			useHierarchyStore.setState({
				...useHierarchyStore.getState(),
				hierarchyData: dummyTreeView,
			});
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');
			await useHierarchyStore
				.getState()
				.toggleCollapse([{ pathId: -9999, pathName: 'dummy' }], true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].collapsed).toBe(
				false,
			);
		});

		it('if node to update is not found it will not update any state', async () => {
			const nodeToUpdatespy = jest
				.spyOn(utilStateHelper, 'getNodeToUpdate')
				.mockReturnValueOnce(undefined);

			const getHierarchyChildDataSpy = jest.spyOn(
				utilStateHelper,
				'getHierarchyChildData',
			);

			await useHierarchyStore
				.getState()
				.toggleCollapse([{ pathId: -999, pathName: 'dummy' }], false);

			expect(nodeToUpdatespy).toReturnWith(undefined);
			expect(getHierarchyChildDataSpy).not.toHaveBeenCalled();
		});
	});

	describe('toggleEdit', () => {
		it('on toggleEdit changes edit state and clears any error', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.toggleEdit(dummyTreeView[0].nodePath, true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].edit).toBe(true);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBeNull();
		});

		it('on toggleEdit will not change state if nodeToUpdate is not found', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.toggleEdit([{ pathId: -9999, pathName: 'dummy' }], true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].edit).toBe(false);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toMatch(
				'dummy error',
			);
		});
	});

	describe('toggleNewEditor', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('toggleNewEditor sets NewEditor Mode Application or Group', async () => {
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

		it('toggleNewEditor will not change state if nodeToUpdate is not found', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.toggleNewEditor([{ pathId: -999, pathName: 'dummy' }], 'Application');

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(
				useHierarchyStore.getState().hierarchyData[0].toggleNewEditor,
			).toBe('');
			expect(useHierarchyStore.getState().hierarchyData[0].collapsed).toBe(
				false,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toEqual(
				'dummy error',
			);
		});

		it('toggleNewEditor will load children nodes if node is collapsed', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');
			const nodeUpdateStateSpy = jest.spyOn(storeHelper, 'nodeUpdateState');
			const brandingSpy = jest
				.spyOn(useHierarchyStore.getState(), 'getPrimaryLogo')
				.mockImplementationOnce(() => undefined);
			const getHierarchyChildDataSpy = jest
				.spyOn(utilStateHelper, 'getHierarchyChildData')
				.mockResolvedValueOnce({ err: null, children: dummyTreeView });

			act(() => {
				useHierarchyStore.setState({
					...useHierarchyStore.getState(),
					hierarchyData: [{ ...dummyTreeView[0], collapsed: true }],
					error: null,
				});
			});

			await useHierarchyStore
				.getState()
				.toggleNewEditor(dummyTreeView[0].nodePath, 'Application');

			expect(nodeUpdateStateSpy).toHaveBeenCalled();
			expect(brandingSpy).toHaveBeenCalled();
			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(getHierarchyChildDataSpy).toHaveBeenCalled();
			expect(
				useHierarchyStore.getState().hierarchyData[0].toggleNewEditor,
			).toBe('Application');
			expect(useHierarchyStore.getState().hierarchyData[0].collapsed).toBe(
				false,
			);
			expect(useHierarchyStore.getState().hierarchyData[0].error).toBeNull();
		});

		it('toggleNewEditor will not load children if toggleNewEditor node is neither Application nor Group', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.toggleNewEditor(dummyTreeView[0].nodePath, '');

			expect(nodeToUpdatespy).toHaveBeenCalled();

			expect(
				useHierarchyStore.getState().hierarchyData[0].toggleNewEditor,
			).toBe('');

			expect(useHierarchyStore.getState().hierarchyData[0].error).toBeNull();
		});
	});
	describe('setSaving', () => {
		it('setSaving will not have any effect on state if nodeToUpdate is not found', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.setSaving(dummyTreeView[0].nodePath, true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(true);
		});

		it('on setSaving a nodes saving is toggled to passed val', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');

			await useHierarchyStore
				.getState()
				.setSaving([{ pathId: -999, pathName: '' }], true);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].saving).toBe(false);
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

		it('setNodeError will not update state if nodeToUpdate is not found', async () => {
			const nodeToUpdatespy = jest.spyOn(utilStateHelper, 'getNodeToUpdate');
			const dummyError: ErrorResponse = {
				errorCode: 0,
				title: 'dummy',
				status: 500,
				errors: ['dummy'],
			};

			await useHierarchyStore
				.getState()
				.setNodeError([{ pathId: -999, pathName: 'dummy' }], dummyError);

			expect(nodeToUpdatespy).toHaveBeenCalled();
			expect(useHierarchyStore.getState().hierarchyData[0].error).toMatch(
				'dummy error',
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

		it('passes empty array to getCreateGroupLink if data.links is falsy', async () => {
			const getCreateGroupLink = jest
				.spyOn(linkHelper, 'getCreateGroupLink')
				.mockImplementationOnce(() => undefined);

			await useHierarchyStore
				.getState()
				.createApplicationGroup(
					{ ...dummyTreeView[0], _links: undefined },
					dummyTreeView[0].nodePath,
					'newAppGroup',
				);

			expect(getCreateGroupLink).toHaveBeenCalledWith([]);
		});
	});

	describe('editApplicationGroup', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});
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

		it('will not affect state if node to update is not found', async () => {
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
					[{ pathId: -9999, pathName: 'dumy' }],
					'editAppGroup',
				);

			expect(getSelfUpdateLink).toHaveBeenCalled();
			expect(getNodeToUpdate).toHaveBeenCalled();
			expect(updateNodeValues).not.toHaveBeenCalled();
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
		beforeEach(() => {
			jest.clearAllMocks();
		});
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

		it('passes empty array to getSelfUpdateLink if data.links is falsy', async () => {
			const getSelfUpdateLink = jest.spyOn(linkHelper, 'getSelfUpdateLink');

			await useHierarchyStore
				.getState()
				.editApplication(
					{ ...dummyTreeView[0], _links: undefined },
					dummyTreeView[0].nodePath,
					'editApp',
					'editValue',
				);

			expect(getSelfUpdateLink).toHaveBeenCalledWith([], false);
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

		it('will not update state if getNodeToUpdate returns falsy', async () => {
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
					[{ pathId: -999, pathName: '' }],
					'editApp',
					'editValue',
				);

			expect(getSelfUpdateLink).toHaveBeenCalled();
			expect(getNodeToUpdate).toHaveBeenCalled();
			expect(updateNodeValues).not.toHaveBeenCalled();
		});
	});
	describe('get Primary key', () => {
		beforeEach(() => {
			useHierarchyStore.setState({
				...useHierarchyStore.getState(),
				activeNodeId: 3,
			});
		});
		it('should get applicationLogo and set to primaryLogo', async () => {
			jest.spyOn(ContentDeliveryClient, 'get').mockResolvedValueOnce({
				success: true,
				data: {
					data: {
						items: [
							{
								name: 'Primary Logo',
								description: 'Descscription',
								displayAsList: false,
								status: 'Published',
								value:
									'https://qa-assets-delivery.cxsrecognize.com/Applications/dc91a61c-5ab0-e711-8b81-005056b80f19/JPEG_example_flower.jpeg',
								publishDate: '2021-07-09T06:02:44.4479464',
								dataType: {
									name: 'Image',
									isStructuredType: false,
									type: 'File',
									_links: [],
								},
								version: 28,
								inherited: false,
								dataTypeName: 'Image',
								cultureCode: 'en-US',
								id: 3,
							},
						],
						offset: 0,
						limit: 25,
						totalCount: 1,
						_links: [],
					},
				},
			});

			await useHierarchyStore
				.getState()
				.getPrimaryLogo('dc91a61c-5ab0-e711-8b81-005056b80f19');

			expect(ContentDeliveryClient.get).toHaveBeenCalledWith(
				'/application/dc91a61c-5ab0-e711-8b81-005056b80f19/content',
				{
					params: {
						Group: 'Website Branding',
						Name: 'Primary Logo',
					},
				},
			);
		});
		it('setPrimaryLogo set the Logo URL', () => {
			useHierarchyStore.getState().setPrimaryLogo('/e2e_default_logo.png');
			expect(useHierarchyStore.getState().primaryLogo).toBe(
				'/e2e_default_logo.png',
			);
		});
		it('should throw invalid response ', async () => {
			jest
				.spyOn(ContentDeliveryClient, 'get')
				.mockRejectedValue(dummyErrorResponse);

			await useHierarchyStore
				.getState()
				.getPrimaryLogo('dc91a61c-5ab0-e711-8b81-005056b80f19');

			expect(ContentDeliveryClient.get).rejects.toEqual(dummyErrorResponse);
		});
	});
});
