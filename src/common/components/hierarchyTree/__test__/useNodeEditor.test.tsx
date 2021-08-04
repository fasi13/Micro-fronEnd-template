import { renderHook } from '@testing-library/react-hooks';
import { useNodeEditor, useNodeEditorProps } from '../hooks/useNodeEditor';

describe('useNodeEditor', () => {
	let dummyProps: useNodeEditorProps;

	beforeEach(() => {
		dummyProps = {
			data: '',
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

		it(`error clear`, () => {
			dummyProps.error = 'Value can not be empty';
			const { result } = renderHook(useNodeEditor, {
				initialProps: dummyProps,
			});

			dummyProps.data = 'test';

			const mockChangeEvent = {
				currentTarget: {
					value: 'dummy',
				},
				target: {
					value: 'dummy',
				},
			} as React.ChangeEvent<HTMLInputElement>;

			result.current.setEditorValue(mockChangeEvent);
			expect(dummyProps.error).toMatch('Add New Application');
		});

		// it('checks if previous value is the same as current value, and if it is it will not call on submit', () => {
		//   dummyProps.data = 'value'; // wrong pattern

		// 	const ren1 = renderHook(useNodeEditor, {
		// 		initialProps: dummyProps,
		// 	});

		//   const {}  = ren1.rerender()

		// 	result.current.checkValidityAndSubmit();

		// 	expect(dummyProps.setError).toHaveBeenCalledWith(
		// 		'Application format should be: Application Name (Value)',
		// 	);
		// });

		// it('checks if previous value is not same as current value, and if it is not it will clear Error , call Onsubmit and update previous value with current value ', () => {});
	});
});
