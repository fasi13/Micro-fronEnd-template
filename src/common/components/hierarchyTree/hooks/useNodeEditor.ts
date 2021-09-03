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
	focusOnEditor: (inputRef: React.RefObject<HTMLInputElement>) => void;
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

	const emptyErrorMsg = 'Value can not be empty';

	const checkValidityAndSubmit = (): void => {
		if (value === '') {
			setError(emptyErrorMsg);
		} else if (preValue.current !== value) {
			clearError();
			preValue.current = value;
			onSubmit(value.trim());
		}
	};

	const nodeEditorPlaceHolder = (): string => {
		if (isApplication) return 'New Application: name (value)';
		return 'New Application Group';
	};

	const setEditorValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (error && preValue.current !== e.target.value) clearError();
		setValue(e.target.value);
	};
	const focusOnEditor = (inputRef: React.RefObject<HTMLInputElement>): void => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
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
		focusOnEditor,
		setEditorValue,
	};
};
