import React, { useEffect, useRef, useState } from 'react';
import { ErrorResponse } from '../../../types';
import { CloseIcon, SpinnerIcon } from '../../icons';

interface NodeEditorPropType {
	onClose: () => void;
	onSubmit: (value: string) => void;
	error: string | null;
	isApplication: boolean;
	isSaving: boolean;
	data?: string;
	setError: (val: ErrorResponse | string) => void;
	clearError: () => void;
}

const nodeEditorPlaceHolder = (isApplication: boolean): string => {
	if (isApplication) return 'Add New Application';
	return 'Add New Application Group';
};

export const NodeEditor: React.FC<NodeEditorPropType> = props => {
	const {
		onClose,
		onSubmit,
		error,
		data,
		isApplication,
		isSaving,
		setError,
		clearError,
	} = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState(data || '');
	const validAppPattern = /^[^)(]+(\([^()]+\)){1}$/g;
	const emptyErrorMsg = 'Value can not be empty';
	const invalidApplicationValueFormatMsg =
		'Application format should be: Application Name (Value)';
	const preValue = useRef(value);

	const checkValidityAndSubmit = (): void => {
		if (value === '') setError(emptyErrorMsg);
		else if (
			isApplication &&
			value.match(validAppPattern)?.filter(m => m !== undefined).length !== 1
		)
			setError(invalidApplicationValueFormatMsg);
		else if (preValue.current !== value) {
			clearError();
			preValue.current = value;
			onSubmit(value);
		}
	};

	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, []);

	return (
		<div className="flex flex-row items-center justify-start w-7/12 h-auto pl-2 pr-4 -ml-4 space-x-2 transition-colors duration-300 ease-linear transform">
			<form
				className="relative h-full shadow-sm"
				onSubmit={e => {
					e.preventDefault();
					checkValidityAndSubmit();
				}}>
				<input
					ref={inputRef}
					type="text"
					name="edit_node"
					disabled={isSaving}
					title={
						isApplication ? 'Application: Name (value)' : 'Application Group'
					}
					required
					id="edit_application"
					className="block h-10.5 w-full pl-2 text-gray-900 placeholder-gray-500 bg-gray-300 border-transparent pr-14 flex-2 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
					placeholder={nodeEditorPlaceHolder(isApplication)}
					aria-invalid="false"
					aria-describedby="email-error"
					value={value}
					onChange={e => {
						if (error && preValue.current !== e.target.value) clearError();
						setValue(e.target.value);
					}}
				/>
				<button
					type="button"
					className={`absolute font-semibold h-10.5 inset-y-0 right-0 flex items-center justify-center w-12 border border-transparent focus:ring-0 focus:outline-non ${
						// eslint-disable-next-line no-nested-ternary
						error ? 'bg-red-400' : isSaving ? 'bg-gray-300' : 'bg-faded-skyblue'
					}`}
					onClick={() => onClose()}>
					{isSaving ? (
						<SpinnerIcon className="" width={20} height={20} />
					) : (
						<CloseIcon className="" width={14} height={14} />
					)}
				</button>
				<p
					className={`mt-2 text-sm text-red-400 ${error ? '' : 'hidden'}`}
					id="node-error">
					{error}
				</p>
			</form>
		</div>
	);
};
