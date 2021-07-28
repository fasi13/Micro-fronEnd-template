import '@testing-library/jest-dom';
import { fireEvent, render, within } from '@testing-library/react';
import React from 'react';
import { changePasswordModalStore } from '../../../../state';
import ChangePasswordModal from '../changePasswordModal';

const changePasswordModalState = changePasswordModalStore.getState();
const modalContainerStr = 'modal-container';
const passwordModalStr = 'password-modal';
const newPasswordStr = 'new-password';
const oldPasswordStr = 'old-password';
const confirmPasswordStr = 'confirm-password';
const confirmErrorMsg = 'confirm-error-msg';

test('Old password text field should accept inputs', () => {
	changePasswordModalState.setShowChangePasswordModal(true);
	render(<ChangePasswordModal />);
	const { getByTestId } = within(document.getElementById(passwordModalStr));
	within(document.body).getByTestId(modalContainerStr);
	const input = getByTestId(oldPasswordStr) as HTMLInputElement;
	fireEvent.change(input, { target: { value: 'test' } });
	expect(input.value).toBe('test');
});

test('New password text field should accept inputs', () => {
	changePasswordModalState.setShowChangePasswordModal(true);
	render(<ChangePasswordModal />);
	const { getByTestId } = within(document.getElementById(passwordModalStr));
	within(document.body).getByTestId(modalContainerStr);
	const input = getByTestId(newPasswordStr) as HTMLInputElement;
	fireEvent.change(input, { target: { value: 'test' } });
	expect(input.value).toBe('test');
});

test('Confirm password text field should accept inputs', () => {
	changePasswordModalState.setShowChangePasswordModal(true);
	render(<ChangePasswordModal />);
	const { getByTestId } = within(document.getElementById(passwordModalStr));
	within(document.body).getByTestId(modalContainerStr);
	const input = getByTestId(confirmPasswordStr) as HTMLInputElement;
	fireEvent.change(input, { target: { value: 'test' } });
	expect(input.value).toBe('test');
});

test('Cancel button should change the global changePasswordModal open state to false', () => {
	changePasswordModalState.setShowChangePasswordModal(true);
	render(<ChangePasswordModal />);
	const { getByTestId } = within(document.getElementById(passwordModalStr));
	within(document.body).getByTestId(modalContainerStr);
	const cancelBtn = getByTestId('cancel-btn') as HTMLInputElement;
	fireEvent.click(cancelBtn);
	expect(changePasswordModalState.showChangePasswordModal).not.toBeTruthy();
});

test('Submit button should not change the global changePasswordModal open state to false', () => {
	changePasswordModalState.setShowChangePasswordModal(true);
	render(<ChangePasswordModal />);
	const { getByTestId } = within(document.getElementById(passwordModalStr));
	within(document.body).getByTestId(modalContainerStr);
	const submitBtn = getByTestId('submit-btn') as HTMLInputElement;
	fireEvent.click(submitBtn);
	expect(changePasswordModalState.showChangePasswordModal).not.toBeTruthy();
});

test('password did not match error message should be displayed when new password and confirm password are not the same', () => {
	changePasswordModalState.setShowChangePasswordModal(true);
	render(<ChangePasswordModal />);
	const { getByTestId } = within(document.getElementById(passwordModalStr));
	within(document.body).getByTestId(modalContainerStr);
	const input2 = getByTestId(newPasswordStr) as HTMLInputElement;
	fireEvent.change(input2, { target: { value: 'test' } });
	const input3 = getByTestId(confirmPasswordStr) as HTMLInputElement;
	fireEvent.change(input3, { target: { value: 'test2' } });
	const checkContent = getByTestId(confirmErrorMsg);
	expect(checkContent).toHaveTextContent('pdm');
});

test('password did not match error message should not be displayed when new password and confirm password are the same', () => {
	changePasswordModalState.setShowChangePasswordModal(true);
	render(<ChangePasswordModal />);
	const { getByTestId } = within(document.getElementById(passwordModalStr));
	within(document.body).getByTestId(modalContainerStr);
	const input2 = getByTestId(newPasswordStr) as HTMLInputElement;
	fireEvent.change(input2, { target: { value: 'test' } });
	const input3 = getByTestId(confirmPasswordStr) as HTMLInputElement;
	fireEvent.change(input3, { target: { value: 'test' } });
	const checkContent = getByTestId(confirmErrorMsg);
	expect(checkContent).not.toHaveTextContent('pdm');
});

test('required error message should  be displayed when input fields are touched and then empty', () => {
	changePasswordModalState.setShowChangePasswordModal(true);
	render(<ChangePasswordModal />);
	const { getByTestId } = within(document.getElementById(passwordModalStr));
	within(document.body).getByTestId(modalContainerStr);

	const input1 = getByTestId(oldPasswordStr) as HTMLInputElement;
	fireEvent.change(input1, { target: { value: 'test' } });
	fireEvent.change(input1, { target: { value: '' } });
	const checkContent = getByTestId('old-error-msg');
	expect(checkContent).toHaveTextContent('required');

	const input2 = getByTestId(newPasswordStr) as HTMLInputElement;
	fireEvent.change(input2, { target: { value: 'test' } });
	fireEvent.change(input2, { target: { value: '' } });
	const checkContent2 = getByTestId('old-error-msg');
	expect(checkContent2).toHaveTextContent('required');

	const input3 = getByTestId(confirmPasswordStr) as HTMLInputElement;
	fireEvent.change(input3, { target: { value: 'test' } });
	fireEvent.change(input3, { target: { value: '' } });
	const checkContent3 = getByTestId(confirmErrorMsg);
	expect(checkContent3).toHaveTextContent('required');
});
