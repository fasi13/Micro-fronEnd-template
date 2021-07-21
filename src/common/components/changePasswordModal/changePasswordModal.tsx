import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from '@material-ui/core';
import React from 'react';
import { changePasswordModalStore } from '../../../state';

function ChangePasswordModal() {
	const open = changePasswordModalStore(state => state.showChangePasswordModal);
	const setOpen = changePasswordModalStore(
		state => state.setShowChangePasswordModal,
	);
	const handleClose = () => {
		setOpen(false);
	};
	const initialFValues = {
		old_password: '',
		new_password: '',
		confirm_password: '',
		formSubmitted: false,
		success: false,
	};

	const [values, setValues] = React.useState(initialFValues);
	const [errors, setErrors] = React.useState({} as any);

	const requiredString = 'This field is required.';
	const validate: any = (fieldValues = values) => {
		const temp: any = { ...errors };
		if ('old_password' in fieldValues && !fieldValues.old_password)
			temp.old_password = requiredString;
		if ('new_password' in fieldValues && !fieldValues.new_password)
			temp.new_password = requiredString;
		if ('confirm_password' in fieldValues && !fieldValues.confirm_password)
			temp.confirm_password = requiredString;
		if (
			'confirm_password' in fieldValues &&
			fieldValues.confirm_password === fieldValues.new_password
		)
			temp.confirm_password = "Password and confirm password don't match";

		setErrors({
			...temp,
		});
	};
	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
		validate({ [name]: value });
	};
	const handleSubmit = (e: any) => {
		e.preventDefault();
		Object.values(errors).every(x => x === '');
		validate();
	};
	return (
		<>
			<div>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
					maxWidth="sm"
					fullWidth>
					<DialogTitle id="form-dialog-title">Change your password</DialogTitle>
					<DialogContent className="p-8">
						<DialogContentText>
							Please add old password and new password to change your current
							password.
						</DialogContentText>
						<TextField
							autoFocus
							margin="dense"
							id="old_password"
							name="old_password"
							label="Old password"
							type="password"
							fullWidth
							onChange={handleInputChange}
							error={!!errors.old_password}
							helperText={errors.old_password ? errors.old_password : ''}
						/>
						<TextField
							margin="dense"
							id="new_password"
							name="new_password"
							label="New Password"
							type="password"
							fullWidth
							onChange={handleInputChange}
							error={!!errors.new_password}
							helperText={errors.new_password ? errors.new_password : ''}
						/>
						<TextField
							margin="dense"
							id="confirm_password"
							name="confirm_password"
							label="Confirm Password"
							type="password"
							fullWidth
							onChange={handleInputChange}
							error={!!errors.confirm_password}
							helperText={
								errors.confirm_password ? errors.confirm_password : ''
							}
						/>
					</DialogContent>
					<div className="p-3">
						<DialogActions>
							<Button onClick={handleClose} color="primary">
								Cancel
							</Button>
							<Button onClick={handleSubmit} color="primary">
								Submit
							</Button>
						</DialogActions>
					</div>
				</Dialog>
			</div>
		</>
	);
}
export default ChangePasswordModal;
