import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Header, UserMenu } from '../header';

const userAvatarStr = 'user-avatar';
const menuTitleStr = 'menu-title';
const menuAvatarStr = 'menu-avatar';
test('Logo must have src = "/E2E_GROUP_LOGO_ORANGE.png" and alt = "E2E Logo"', () => {
	render(<Header />);
	const logo = screen.getByRole('img');
	expect(logo).toHaveAttribute('src', '/E2E_GROUP_LOGO_ORANGE.png');
	expect(logo).toHaveAttribute('alt', 'E2E Logo');
});

test('Menu Title should contain "Manage Communication"', () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId(menuTitleStr);
	expect(menuTitleElt.textContent).toBe('Manage Communication');
});

test('User Avatar rendered with correct initials when first name and last name is provided', () => {
	const fullName = 'Derese Getachew';
	const { getByTestId } = render(<UserMenu nameOfUser={fullName} />);
	const userAvatar = getByTestId(userAvatarStr);
	expect(userAvatar.textContent).toBe('DG');
});

test('User Avatar rendered with correct initials when only first name is provided', () => {
	const fullName = 'Derese';
	const { getByTestId } = render(<UserMenu nameOfUser={fullName} />);
	const userAvatar = getByTestId(userAvatarStr);
	expect(userAvatar.textContent).toBe('DE');
});

test('User Avatar rendered with correct initials when noting provided', () => {
	const fullName = '';
	const { getByTestId } = render(<UserMenu nameOfUser={fullName} />);
	const userAvatar = getByTestId(userAvatarStr);
	expect(userAvatar.textContent).toBe('?');
});

test('UserMenu contains correct className when true is passed to isOpened prop', () => {
	const { getByTestId } = render(<UserMenu nameOfUser="Abc Def" isOpened />);
	const userAvatar = getByTestId(userAvatarStr);
	expect(userAvatar.className).toContain('active');
});

test('UserMenu contains correct className when false is passed to isOpened prop', () => {
	const { getByTestId } = render(
		<UserMenu nameOfUser="Abc Def" isOpened={false} />,
	);
	const userAvatar = getByTestId(userAvatarStr);
	expect(userAvatar.className).not.toContain('active');
});

test('click on Manage communication menu should display popups', () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId(menuTitleStr);
	fireEvent.click(menuTitleElt);

	const clntmgt = getByTestId('clntmgt');
	expect(clntmgt).toBeInTheDocument();
	const cntntmgt = getByTestId('cntntmgt');
	expect(cntntmgt).toBeInTheDocument();
	const manageCommunication = getByTestId('manage-communication');
	expect(manageCommunication).toBeInTheDocument();
	const programs = getByTestId('programs');
	expect(programs).toBeInTheDocument();
	const priceSettings = getByTestId('price-settings');
	expect(priceSettings).toBeInTheDocument();
	const roles = getByTestId('roles');
	expect(roles).toBeInTheDocument();
	const invoiceMgt = getByTestId('invoice-mgt');
	expect(invoiceMgt).toBeInTheDocument();
	const settingsMgt = getByTestId('settings-mgt');
	expect(settingsMgt).toBeInTheDocument();
	const userPermission = getByTestId('user-permission');
	expect(userPermission).toBeInTheDocument();
});

test('click on Account avatar menu should display popups', () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId(userAvatarStr);
	fireEvent.click(menuTitleElt);
	const changePassword = getByTestId('change-password');
	expect(changePassword).toBeInTheDocument();
	const logout = getByTestId('logout');
	expect(logout).toBeInTheDocument();
});

test('clicking on UserMenu Avatar should have an active class', () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId(menuAvatarStr);
	fireEvent.click(menuTitleElt);

	const userAvatar = getByTestId(userAvatarStr);
	expect(userAvatar.className).toContain('active');
});

test('clicking on UserMenu Avatar should call functions ', () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId(menuAvatarStr);
	fireEvent.click(menuTitleElt);
	const avatarMenu = getByTestId('avatar-menu');
	expect(avatarMenu).toBeInTheDocument();
});

test('changing changePasswordModal global state to true should display change password modal', () => {
	const { getByTestId } = render(<Header />);
	const userAvatarMenu = getByTestId(userAvatarStr);
	fireEvent.click(userAvatarMenu);

	const changePasswordMenu = getByTestId('change-password-menu');
	fireEvent.click(changePasswordMenu);
	const changePasswordModal = getByTestId('change-password-modal');
	expect(changePasswordModal).toBeInTheDocument();
});

test('Clicking in menu should contain correct className', () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId(menuTitleStr);
	fireEvent.click(menuTitleElt);
	const expandMenuIcon = getByTestId('expand-menu-icon');
	expect(expandMenuIcon.className).toContain('rotate-180');
});

// test('Clicking on menu after it is opened should close the menu', () => {
// 	const { getByTestId, getByRole } = render(<Header />);

// 	fireEvent.click(getByTestId(menuTitleStr));

// 	// Get the backdrop, then get the firstChild because this is where the event listener is attached
// 	fireEvent.click(sgetByText('Name').parentElement);
// 	expect(queryByRole('presentation')).toBeNull();
// });
