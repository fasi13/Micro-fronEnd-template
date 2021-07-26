import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import ChangePasswordModal from '../changePasswordModal';

test('Logo must have src = "/E2E_GROUP_LOGO_ORANGE.png" and alt = "E2E Logo"', () => {
	render(<ChangePasswordModal />);
	expect(logo).toHaveAttribute('src', '/E2E_GROUP_LOGO_ORANGE.png');
	expect(logo).toHaveAttribute('alt', 'E2E Logo');
});
