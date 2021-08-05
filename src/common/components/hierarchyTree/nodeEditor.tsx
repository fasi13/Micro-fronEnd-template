import React, { useEffect, useRef } from 'react';
import { ErrorResponse } from '../../../types';
import { CloseIcon, SpinnerIcon } from '../../icons';
import { useNodeEditor } from './hooks/useNodeEditor';

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
	const {
		checkValidityAndSubmit,
		nodeEditorPlaceHolder,
		focusOnEditor,
		value,
		setEditorValue,
		closeButtonStyling,
	} = useNodeEditor({
		data,
		isSaving,
		isApplication,
		error,
		setError,
		clearError,
		onSubmit,
	});

	useEffect(() => {
		focusOnEditor(inputRef);
	}, []);

	return (
		<div
			data-testid="node-editor-component"
			className="flex flex-row items-center justify-start w-10/12 h-auto pl-2 pr-4 -ml-4 space-x-2 transition-colors duration-300 ease-linear transform lg:w-10/12">
			<form
				data-testid="node-editor-form"
				className="relative h-full shadow-sm"
				onSubmit={e => {
					e.preventDefault();
					checkValidityAndSubmit();
				}}>
				<input
					data-testid="node-editor-input"
					ref={inputRef}
					type="text"
					name="edit_node"
					disabled={isSaving}
					title={nodeEditorPlaceHolder()}
					id="edit_application"
					className="block h-10.5 w-full pl-2 text-gray-900 placeholder-gray-500 bg-gray-300 border-transparent pr-14 flex-2 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
					placeholder={nodeEditorPlaceHolder()}
					aria-invalid="false"
					aria-describedby="email-error"
					value={value}
					onChange={setEditorValue}
				/>
				<button
					data-testid="node-cancel-btn"
					type="button"
					className={`absolute font-semibold h-10.5 inset-y-0 right-0 flex items-center justify-center w-12 border border-transparent focus:ring-0 focus:outline-non ${closeButtonStyling()}`}
					onClick={() => onClose()}>
					{isSaving ? (
						<div data-testid="spinner-icon">
							<SpinnerIcon className="" width={20} height={20} />
						</div>
					) : (
						<div data-testid="close-icon">
							<CloseIcon className="" width={14} height={14} />
						</div>
					)}
				</button>
				<p
					data-testid="node-editor-error"
					className={`mt-2 text-sm text-red-400 ${error ? '' : 'hidden'}`}
					id="node-error">
					{error}
				</p>
			</form>
		</div>
	);
};
