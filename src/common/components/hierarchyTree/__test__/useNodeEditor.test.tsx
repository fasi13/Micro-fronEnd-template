import { renderHook } from '@testing-library/react-hooks';
import { useNodeEditor, useNodeEditorProps } from '../hooks/useNodeEditor';

describe('useNodeEditor', () => {
	let dummyProps: useNodeEditorProps;

	beforeEach(() => {
		dummyProps = {
			data: '',
			error: '',
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
				'Add New Application',
			);
		});

		it(`returns 'Add New Application Group' if node is not Application`, () => {
			dummyProps.isApplication = false;
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			expect(result.current.nodeEditorPlaceHolder()).toMatch(
				'Add New Application Group',
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

		it(`checks if value has valid pattern name (value) if isApplication is true ,  if pattern is wrong setError gets called `, () => {
			dummyProps.data = 'name ((value))'; // wrong pattern
			dummyProps.isApplication = true;

			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			result.current.checkValidityAndSubmit();

			expect(dummyProps.setError).toHaveBeenCalledWith(
				'Application format should be: Application Name (Value)',
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

			result.current.setEditorValue(mockChangeEvent);
			expect(dummyProps.clearError).toHaveBeenCalled();
		});

		it('sets the value of the editor', () => {
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

			result.current.setEditorValue(mockChangeEvent);

			expect(result.current.value).toMatch('new value');
		});
	});
});
