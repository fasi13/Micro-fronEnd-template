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
test('click on Account avatar menu should display popups', () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId(userAvatarStr);
	fireEvent.click(menuTitleElt);
	const changePassword = getByTestId('change-password');
	expect(changePassword).toBeInTheDocument();
	const logout = getByTestId('logout');
	expect(logout).toBeInTheDocument();
});

test('key pressing with "Enter" on Account avatar menu should display popups', () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId(userAvatarStr);
	fireEvent.keyDown(menuTitleElt, { key: 'Enter' });
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

test('Clicking on another screen place after the "Manage Communication menu" should close it', () => {
	const { getByTestId, getByRole, queryByRole } = render(<Header />);
	fireEvent.click(getByTestId(menuTitleStr));
	fireEvent.click(
		getByRole('presentation').firstChild ?? getByRole('presentation'),
	);
	expect(queryByRole('presentation')).toBeNull();
});

test('Clicking on another screen place after the opening "User Avatar menu" should close it', () => {
	const { getByTestId, getByRole, queryByRole } = render(<Header />);
	fireEvent.click(getByTestId(menuAvatarStr));
	fireEvent.click(
		getByRole('presentation').firstChild ?? getByRole('presentation'),
	);
	expect(queryByRole('presentation')).toBeNull();
});
