import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useChangePasswordModalStore } from '../../../state';
import './changePasswordModal.scss';

const ChangePasswordModal: React.FunctionComponent = () => {
	const open = useChangePasswordModalStore(
		state => state.showChangePasswordModal,
	);
	const requiredStr = 'This field is required.';
	const passwordDidNotMatchStr = 'Password did not match.';
	const setOpen = useChangePasswordModalStore(
		state => state.setShowChangePasswordModal,
	);
	const handleClose = () => {
		setOpen(false);
	};

	const [oldPassword, setOldPassword] = React.useState('');
	const [newPassword, setNewPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');

	const [oldPasswordErrorMsg, setOldPasswordErrorMsg] = React.useState('');
	const [newPasswordErrorMsg, setNewPasswordErrorMsg] = React.useState('');
	const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] =
		React.useState('');

	const validateAllFields = () =>
		oldPasswordErrorMsg !== '' ||
		newPasswordErrorMsg !== '' ||
		confirmPasswordErrorMsg !== '';

	const handleSubmit2 = (evt: any) => {
		evt.preventDefault();
		// if (!validateAllFields())
		alert(`Submitting ${oldPassword} ${newPassword} ${confirmPassword}`);
	};

	const handleOldPassword = (e: any) => {
		setOldPassword(e.target.value);
		if (e.target.value === '') setOldPasswordErrorMsg(requiredStr);
		else setOldPasswordErrorMsg('');
	};
	const handleNewPassword = (e: any) => {
		setNewPassword(e.target.value);
		if (e.target.value === '') setNewPasswordErrorMsg(requiredStr);
		else setNewPasswordErrorMsg('');
		if (e.target.value !== confirmPassword) {
			setConfirmPasswordErrorMsg(confirmPasswordErrorMsg);
		} else {
			setConfirmPasswordErrorMsg('');
		}
	};
	const handleConfirmPassword = (e: any) => {
		setConfirmPassword(e.target.value);
		if (e.target.value === '') setConfirmPasswordErrorMsg(requiredStr);
		else if (e.target.value !== newPassword) {
			setConfirmPasswordErrorMsg(passwordDidNotMatchStr);
		} else {
			setConfirmPasswordErrorMsg('');
		}
	};

	return (
		<>
			<Dialog
				id="password-modal"
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				maxWidth="sm"
				fullWidth>
				<form onSubmit={handleSubmit2}>
					<DialogTitle id="form-dialog-title">Change your password</DialogTitle>
					<DialogContent className="p-8">
						<DialogContentText>
							Please add old password and new password to change your current
							password.
						</DialogContentText>
						<div data-testid="modal-container">
							<TextField
								inputProps={{ 'data-testid': 'old-password' }}
								margin="dense"
								id="oldPassword"
								name="oldPassword"
								label="Old Password"
								type="password"
								fullWidth
								onChange={handleOldPassword}
								error={oldPasswordErrorMsg !== ''}
							/>
							<span className="error-msg" data-testid="old-error-msg">
								{oldPasswordErrorMsg}
							</span>
							<TextField
								inputProps={{ 'data-testid': 'new-password' }}
								margin="dense"
								id="newPassword"
								name="newPassword"
								label="New Password"
								type="password"
								fullWidth
								onChange={handleNewPassword}
								error={newPasswordErrorMsg !== ''}
							/>
							<span className="error-msg" data-testid="new-error-msg">
								{newPasswordErrorMsg}
							</span>
							<br />
							<TextField
								inputProps={{ 'data-testid': 'confirm-password' }}
								margin="dense"
								id="confirmPassword"
								name="confirmPassword"
								label="Confirm Password"
								type="password"
								fullWidth
								onChange={handleConfirmPassword}
								error={newPasswordErrorMsg !== ''}
							/>
							<span className="error-msg" data-testid="confirm-error-msg">
								{confirmPasswordErrorMsg}
							</span>
						</div>
					</DialogContent>
					<div className="p-3">
						<DialogActions>
							<div className="space-x-5">
								<button
									type="button"
									data-testid="cancel-btn"
									onClick={handleClose}>
									Cancel
								</button>
								<button
									className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
									disabled={validateAllFields()}
									data-testid="submit-btn"
									type="submit">
									Submit
								</button>
							</div>
						</DialogActions>
					</div>
				</form>
			</Dialog>
		</>
	);
};
export default ChangePasswordModal;
