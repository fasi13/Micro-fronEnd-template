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

		it('checks if current and previous are the same', () => {
			dummyProps.data = 'New Application Group(1919)'; // wrong pattern
			dummyProps.isApplication = true;
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});
			result.current.preValue.current = 'New Application Group(1919)';
			result.current.checkValidityAndSubmit();
			expect(dummyProps.onSubmit).not.toBeCalled();
		});
	});
});
