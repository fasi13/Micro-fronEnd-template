import { act, renderHook } from '@testing-library/react-hooks';
import { TUseNodeEditorProps, useNodeEditor } from '../hooks/useNodeEditor';

describe('useNodeEditor', () => {
	let dummyProps: TUseNodeEditorProps;
	const dummyInput = 'New Application Group(2021)';
	beforeEach(() => {
		dummyProps = {
			data: '',
			error: '',
			isSaving: false,
			isApplication: true,
			setError: jest.fn(),
			clearError: jest.fn(),
			onSubmit: jest.fn(),
		};
	});
	describe('useNodeEditor snapShot return values', () => {
		it('returns object of helper methods', () => {
			const result = renderHook(useNodeEditor, { initialProps: dummyProps });
			expect(result).toMatchSnapshot();
		});
	});

	describe('nodeEditorPlaceHolder', () => {
		it(`returns 'Add New Application' if node is Application`, () => {
			dummyProps.isApplication = true;
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			expect(result.current.nodeEditorPlaceHolder()).toMatch(
				'New Application: name (value)',
			);
		});

		it(`returns 'Add New Application Group' if node is not Application`, () => {
			dummyProps.isApplication = false;
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			expect(result.current.nodeEditorPlaceHolder()).toMatch(
				'New Application Group',
			);
		});
	});

	describe('checkValidityAndSubmit', () => {
		it('it calls set Error if passed in value is empty string', () => {
			dummyProps.data = '';

			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			result.current.checkValidityAndSubmit();

			expect(dummyProps.setError).toHaveBeenCalledWith(
				'Value can not be empty',
			);
		});
		it('checks if the input form is submit properly', () => {
			dummyProps.data = 'New Application Group(2021)'; // wrong pattern
			dummyProps.isApplication = true;
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			result.current.preValue.current = 'New Application Group(2026)';
			result.current.checkValidityAndSubmit();
			expect(dummyProps.onSubmit).toBeCalledTimes(1);
		});

		it('checks if current and new values are the same', () => {
			dummyProps.data = dummyInput; // wrong pattern
			dummyProps.isApplication = true;
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			result.current.preValue.current = dummyInput;
			result.current.checkValidityAndSubmit();
			expect(dummyProps.onSubmit).not.toBeCalled();
		});
	});

	describe('setEditorValue', () => {
		it('sets the value of the editor', async () => {
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			const mockChangeEvent = {
				currentTarget: {
					value: '',
				},
				target: {
					value: 'new value',
				},
			} as React.ChangeEvent<HTMLInputElement>;

			act(() => result.current.setEditorValue(mockChangeEvent));

			expect(result.current.value).toMatch('new value');
		});

		it(`clears editor value if error existed and preValue is not equal to current Editor Value`, () => {
			dummyProps.error = 'Value can not be empty';
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});

			result.current.preValue.current = 'old value';
			const mockChangeEvent = {
				currentTarget: {
					value: '',
				},
				target: {
					value: 'new value',
				},
			} as React.ChangeEvent<HTMLInputElement>;

			act(() => result.current.setEditorValue(mockChangeEvent));
			expect(dummyProps.clearError).toHaveBeenCalled();
		});
	});

	describe('focusOnEditor', () => {
		it('sets focus on passed in html input element', () => {
			const props: TUseNodeEditorProps = {
				clearError: jest.fn(),
				data: '',
				error: null,
				isApplication: false,
				isSaving: false,
				onSubmit: jest.fn(),
				setError: jest.fn(),
			};

			const RefInit = {
				current: {
					focus: jest.fn(),
				},
			} as unknown as React.RefObject<HTMLInputElement>;
			const { result } = renderHook(useNodeEditor, { initialProps: props });
			result.current.focusOnEditor(RefInit);
			expect(RefInit.current?.focus).toHaveBeenCalled();
		});

		it('does not call focus on input Ref if passed input Ref is not initialized ', () => {
			const props: TUseNodeEditorProps = {
				clearError: jest.fn(),
				data: '',
				error: null,
				isApplication: false,
				isSaving: false,
				onSubmit: jest.fn(),
				setError: jest.fn(),
			};

			const RefInit = {
				current: null,
			} as unknown as React.RefObject<HTMLInputElement>;
			const { result } = renderHook(useNodeEditor, { initialProps: props });
			result.current.focusOnEditor(RefInit);
			expect(RefInit.current).toBeFalsy();
		});
	});

	describe('closeButtonStyling', () => {
		it('returns bg-red-400 if node has error', () => {
			dummyProps.error = 'dummyError';
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			const classNames = result.current.closeButtonStyling();
			expect(classNames).toMatch('bg-red-400');
		});

		it('returns bg-gray-300 if node is saving', () => {
			dummyProps.isSaving = true;
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			const classNames = result.current.closeButtonStyling();
			expect(classNames).toMatch('bg-gray-300');
		});

		it('returns bg-faded-skyblue for a default node state', () => {
			dummyProps.isSaving = false;
			dummyProps.error = '';

			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			const classNames = result.current.closeButtonStyling();
			expect(classNames).toMatch('bg-faded-skyblue');
		});
	});
});
