import { useRef, useState } from 'react';
import { ErrorResponse } from '../../../../types';

export interface useNodeEditorProps {
	data: string | undefined;
	isApplication: boolean;
	error: string | null;
	setError: (val: ErrorResponse | string) => void;
	clearError: () => void;
	onSubmit: (value: string) => void;
}

interface useNodeEditorReturnType {
	checkValidityAndSubmit: () => void;
	value: string;
	nodeEditorPlaceHolder: () => string;
	setEditorValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useNodeEditor = (
	props: useNodeEditorProps,
): useNodeEditorReturnType => {
	const { data, isApplication, error, setError, clearError, onSubmit } = props;

	const [value, setValue] = useState(data || '');
	const preValue = useRef(value);

	const validAppPattern = /^[^)(]+(\([^()]+\)){1}$/g;
	const emptyErrorMsg = 'Value can not be empty';
	const invalidApplicationValueFormatMsg =
		'Application format should be: Application Name (Value)';

	const checkValidityAndSubmit = (): void => {
		if (value === '') {
			setError(emptyErrorMsg);
		} else if (
			isApplication &&
			value.match(validAppPattern)?.filter(m => m !== undefined).length !== 1
		) {
			setError(invalidApplicationValueFormatMsg);
		} else if (preValue.current !== value) {
			clearError();
			preValue.current = value;
			onSubmit(value);
		}
	};

	const nodeEditorPlaceHolder = (): string => {
		if (isApplication) return 'Add New Application';
		return 'Add New Application Group';
	};

	const setEditorValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (error && preValue.current !== e.target.value) clearError();
		setValue(e.target.value);
	};

	return {
		checkValidityAndSubmit,
		nodeEditorPlaceHolder,
		value,
		setEditorValue,
	};
};
