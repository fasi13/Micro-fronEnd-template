import { useRef, useState } from 'react';
import { ErrorResponse } from '../../../../types';

export interface TUseNodeEditorProps {
	data: string | undefined;
	isSaving: boolean;
	isApplication: boolean;
	error: string | null;
	setError: (val: ErrorResponse | string) => void;
	clearError: () => void;
	onSubmit: (value: string) => void;
}

interface TUseNodeEditorReturnType {
	checkValidityAndSubmit: () => void;
	preValue: React.MutableRefObject<string>;
	value: string;
	nodeEditorPlaceHolder: () => string;
	setEditorValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
	closeButtonStyling: () => string;
}

export const useNodeEditor = (
	props: TUseNodeEditorProps,
): TUseNodeEditorReturnType => {
	const {
		data,
		isApplication,
		isSaving,
		error,
		setError,
		clearError,
		onSubmit,
	} = props;

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

	const closeButtonStyling = (): string => {
		if (error) return 'bg-red-400';
		if (isSaving) return 'bg-gray-300';

		return 'bg-faded-skyblue';
	};

	return {
		checkValidityAndSubmit,
		nodeEditorPlaceHolder,
		closeButtonStyling,
		preValue,
		value,
		setEditorValue,
	};
};
