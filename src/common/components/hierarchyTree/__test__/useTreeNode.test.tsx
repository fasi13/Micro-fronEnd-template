import { renderHook } from '@testing-library/react-hooks';
import { TreeView } from '../../../../types';
import { TUseTreeNodeProps, useTreeNode } from '../hooks/useTreeNode';

let dummyProps: TUseTreeNodeProps;
let dummyTreeView: TreeView;
const selfUpdateStr = 'dummy/selfupdate';
const createGroupStr = 'dummy/createGroup';
const createAppStr = 'dummy/createApp';

describe('useTreeNode', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		dummyTreeView = {
			id: 1,
			name: 'dummy-name',
			value: 'dummy-value',
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
					name: 'createApplication',
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
		dummyProps = {
			data: { ...dummyTreeView },
			nodePath: dummyTreeView.nodePath,
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

	describe('useTreeNode snapShot return values', () => {
		it('returns object of helper methods', () => {
			const result = renderHook(useTreeNode, { initialProps: dummyProps });
			expect(result).toMatchSnapshot();
		});
	});

	describe('canAddApplication', () => {
		it('returns true if node has link with rel createApplication', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});

			expect(result.current.canAddApplication(dummyTreeView)).toBe(true);
		});
	});

	describe('showHideNewEditorAndTreeChildren', () => {
		it('returns mb-10 if is collapse is false and editorMode is not empty', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});
			expect(
				result.current.showHideNewEditorAndTreeChildren(false, 'Application'),
			).toBe('mb-10');
		});

		it('returns empty string if is collapsed is false and editorMode is empty', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});
			expect(result.current.showHideNewEditorAndTreeChildren(false, '')).toBe(
				'',
			);
		});

		it('returns hidden text if is collapsed is true', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});
			expect(result.current.showHideNewEditorAndTreeChildren(true, '')).toBe(
				'hidden',
			);
		});
	});

	describe('nodeValue', () => {
		it('returns name as it is if it is group', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});
			expect(result.current.nodeValue()).toEqual('dummy-name');
		});

		it('returns name with value if it is application', () => {
			dummyProps.data._links = dummyProps.data?._links.filter(
				l => l.rel !== 'createApplication',
			);
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});
			expect(result.current.nodeValue()).toEqual('dummy-name (dummy-value)');
		});
	});

	describe('extractApplicationNameAndValue', () => {
		it(`given 'name (value)' it returns array of ['name','value']`, () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});

			const val: string[] =
				result.current.extractApplicationNameAndValue('name (value)');

			expect(val).toContain('name ');
			expect(val).toContain('value');
		});

		it(`given 'dummytext' it returns array of ['dummytext']`, () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});

			const val: string[] =
				result.current.extractApplicationNameAndValue('dummytext');

			expect(val.length).toBe(2);
			expect(val[0]).toContain('dummytext');
			expect(val[1]).toContain('dummytext');

		});

		it(`given '' it returns array of ['','']`, () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});

			const val: string[] = result.current.extractApplicationNameAndValue('');

			expect(val).toContain('');
			expect(val).toContain('');
		});
	});

	describe('submitHandler', () => {
		it('calls onEditGroup', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: { ...dummyProps, data: { ...dummyTreeView, edit: true } },
			});

			result.current.submitHandler('newValue');

			expect(dummyProps.onEditGroup).toHaveBeenCalled();
		});

		it('calls onEditApplication', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: {
					...dummyProps,
					data: {
						...dummyTreeView,
						edit: true,
						_links: dummyTreeView?._links.filter(
							l => l.rel !== 'createApplication',
						),
					},
				},
			});

			result.current.submitHandler('newValue');

			expect(dummyProps.onEditApplication).toHaveBeenCalled();
		});

		it('calls onAddApplication', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: {
					...dummyProps,
					data: {
						...dummyTreeView,
						edit: false,
						toggleNewEditor: 'Application',
					},
				},
			});

			result.current.submitHandler('newValue');

			expect(dummyProps.onAddApplication).toHaveBeenCalled();
		});

		it('calls onAddGroup', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: {
					...dummyProps,
					data: {
						...dummyTreeView,
						edit: false,
						toggleNewEditor: 'Group',
					},
				},
			});

			result.current.submitHandler('newValue');

			expect(dummyProps.onAddGroup).toHaveBeenCalled();
		});

		it('calls nothing if it is not in edit mode and toggleNewEditor emptyString', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: {
					...dummyProps,
					data: {
						...dummyTreeView,
						edit: false,
						toggleNewEditor: '',
					},
				},
			});

			result.current.submitHandler('newValue');

			expect(dummyProps.onEditGroup).not.toHaveBeenCalled();
			expect(dummyProps.onEditApplication).not.toHaveBeenCalled();
			expect(dummyProps.onAddApplication).not.toHaveBeenCalled();
			expect(dummyProps.onAddGroup).not.toHaveBeenCalled();
		});
	});

	describe('closeEditor', () => {
		it('calls onToggleEdit', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});

			result.current.closeEditor();

			expect(dummyProps.onToggleEdit).toHaveBeenCalled();
		});
	});

	describe('setErrorHandler', () => {
		it('calls onSetNodeErr', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});

			result.current.setErrorHandler('dummy-error');

			expect(dummyProps.onSetNodeErr).toHaveBeenCalledWith(
				[{ pathId: 1, pathName: 'dummy' }],
				'dummy-error',
			);
		});
	});

	describe('clearErrorHandler', () => {
		it('calls onSetNodeErr', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});

			result.current.clearErrorHandler();

			expect(dummyProps.onSetNodeErr).toHaveBeenCalled();
		});
	});

	describe('toggleEdit', () => {
		it('toggleEdit calls onToggleEdit', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});
			const spy = jest.spyOn(result.current, 'toggleEdit');
			result.current.toggleEdit();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('toggleChildren', () => {
		it('toggleChildren calls onToggleEdit', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});
			const spy = jest.spyOn(result.current, 'toggleChildren');
			result.current.toggleChildren();
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('toggleNewEditor', () => {
		it('toggleNewEditor calls onToggleEdit', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});
			const spy = jest.spyOn(result.current, 'toggleNewEditor');
			result.current.toggleNewEditor('Application');
			expect(spy).toHaveBeenCalled();
		});
	});

	describe('closeNewEditor', () => {
		it('closeNewEditor calls onToggleEdit', () => {
			const { result } = renderHook(useTreeNode, {
				initialProps: dummyProps,
			});
			const spy = jest.spyOn(result.current, 'closeNewEditor');
			result.current.closeNewEditor();
			expect(spy).toHaveBeenCalled();
		});
	});
});
