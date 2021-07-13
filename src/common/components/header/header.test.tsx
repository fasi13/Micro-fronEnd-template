import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Header, UserMenu } from './header';

const userAvatarStr = 'user-avatar';
test('Logo must have src = "/E2E_GROUP_LOGO_ORANGE.png" and alt = "E2E Logo"', () => {
	render(<Header />);
	const logo = screen.getByRole('img');
	expect(logo).toHaveAttribute('src', '/E2E_GROUP_LOGO_ORANGE.png');
	expect(logo).toHaveAttribute('alt', 'E2E Logo');
});

test('Menu Title should contain "Manage Communication"', () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId('menu-title');
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

test('click on Manage communication menu should display popups', async () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId('menu-title');
	await fireEvent.click(menuTitleElt);
	await waitFor(() => {
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
});

test('click on Account avatar menu should display popups', async () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId('menu-avatar');
	await fireEvent.click(menuTitleElt);
	await waitFor(() => {
		const changepassword = getByTestId('change-password');
		expect(changepassword).toBeInTheDocument();
		const logout = getByTestId('logout');
		expect(logout).toBeInTheDocument();
	});
});

test('click on UserMenu Avatar should have an active class', async () => {
	const { getByTestId } = render(<Header />);
	const menuTitleElt = getByTestId('menu-avatar');
	await fireEvent.click(menuTitleElt);
	await waitFor(() => {
		const userAvatar = getByTestId('user-avatar');
		expect(userAvatar.className).toContain('active');
	});
});
