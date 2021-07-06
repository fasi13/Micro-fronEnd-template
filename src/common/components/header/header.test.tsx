import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
