import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
import { useHierarchyStore } from '../../../../state';
import { TreeView } from '../../../../types';
import { useHierarchyHelper } from '../hooks/useHierarchyHelper';

interface NodePath {
	pathName: string;
	pathId: number;
}

describe('setNodeErrorFn', () => {
	const selfupdateUrl = 'dummy/selfupdate';
	const createGroupUrl = 'dummy/createGroup';
	const createAppUrl = 'dummy/createApp';
	const childrenAppUrl = 'dummy/children_application';
	const childrenAppGroupUrl = 'dummy/children_applicationGroup';

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
	const nodePathStub: NodePath[] = [{ pathId: 1, pathName: 'dummy' }];
	const err = 'error';
	it('is setNodeErrorFn return error', () => {
		const { result } = renderHook(useHierarchyHelper);
		act(() => result.current.setNodeErrorFn(nodePathStub, err));
		expect(useHierarchyStore.getState().hierarchyData[0].error).toBe('error');
	});

	it('is setSavingFn called', async () => {
		const { result } = renderHook(useHierarchyHelper);
		const spy = jest.spyOn(result.current, 'setSavingFn');
		await result.current.setSavingFn(nodePathStub, true);
		expect(spy).toHaveBeenCalled();
	});

	it('is toggleNewEditor called', async () => {
		const { result } = renderHook(useHierarchyHelper);
		const spy = jest.spyOn(result.current, 'toggleNewEditorFn');
		await result.current.toggleNewEditorFn(nodePathStub, '');
		expect(spy).toHaveBeenCalled();
	});

	it('is toggleEditNodeFn called', async () => {
		const { result } = renderHook(useHierarchyHelper);
		const spy = jest.spyOn(result.current, 'toggleEditNodeFn');
		await result.current.toggleEditNodeFn(nodePathStub, true);
		expect(spy).toHaveBeenCalled();
	});

	it('is toggleCollapseNodeFn called', async () => {
		const { result } = renderHook(useHierarchyHelper);
		const spy = jest.spyOn(result.current, 'toggleCollapseNodeFn');
		await result.current.toggleCollapseNodeFn(nodePathStub, true);
		expect(spy).toHaveBeenCalled();
	});

	it('is onEditGroupFn called', async () => {
		const { result } = renderHook(useHierarchyHelper);
		const spy = jest.spyOn(result.current, 'onEditGroupFn');
		await result.current.onEditGroupFn(
			dummyTreeView[0],
			nodePathStub,
			'editApp',
		);
		expect(spy).toHaveBeenCalled();
	});

	it('is onEditApplicationFn called', async () => {
		const { result } = renderHook(useHierarchyHelper);
		const spy = jest.spyOn(result.current, 'onEditApplicationFn');
		await result.current.onEditApplicationFn(
			dummyTreeView[0],
			nodePathStub,
			'editApp',
			'editValue',
		);
		expect(spy).toHaveBeenCalled();
	});

	it('is onAddApplicationFn called', async () => {
		const { result } = renderHook(useHierarchyHelper);
		const spy = jest.spyOn(result.current, 'onAddApplicationFn');
		await result.current.onAddApplicationFn(
			dummyTreeView[0],
			nodePathStub,
			'editApp',
			'editValue',
		);
		expect(spy).toHaveBeenCalled();
	});

	it('is onAddGroupFn called', async () => {
		const { result } = renderHook(useHierarchyHelper);
		const spy = jest.spyOn(result.current, 'onAddGroupFn');
		await result.current.onAddGroupFn(
			dummyTreeView[0],
			nodePathStub,
			'editApp',
		);
		expect(spy).toHaveBeenCalled();
	});
});
