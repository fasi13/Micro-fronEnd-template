import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Home } from '../../../../pages/home/home';
import { detachStore } from '../../../../state';
import { HeaderSecond } from '../headerSecond';

const detachIconStr = 'detach-icon';
const dSSidebarState = detachStore.getState();
test('renders home component', () => {
	render(<HeaderSecond />);
});

test(' detached sidebar should be displayed when detachSidebar global state is assigned to true', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	expect(Rnd).toBeInTheDocument();
});

test('detach-icon should contains correct className when detachSidebar (global state) is assigned to be true', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<HeaderSecond />);
	const detachIcon = getByTestId(detachIconStr);
	expect(detachIcon.className).toContain('sidebarDetached');
});

test('detach-icon should contains correct className when detachSidebar (global state) is assigned to be false', () => {
	dSSidebarState.setDetachSidebar(false);
	const { getByTestId } = render(<HeaderSecond />);
	const detachIcon = getByTestId(detachIconStr);
	expect(detachIcon.className).not.toContain('sidebarDetached');
});

test('detach-icon should contains correct className when detach-handler div is key pressed with "Enter" key', async () => {
	const { getByTestId, debug } = render(<HeaderSecond />);
	const detachHandler = getByTestId('detach-handler');
	fireEvent.focus(detachHandler);
	fireEvent.keyDown(detachHandler, { key: 'Enter' });
	const detachIcon = getByTestId(detachIconStr);
	debug();
	expect(detachIcon.className).toContain('sidebarDetached');
});

test('detach-icon should contains correct className when detach-handler div is key pressed with "Space" key', async () => {
	const { getByTestId, debug } = render(<HeaderSecond />);
	const detachHandler = getByTestId('detach-handler');
	fireEvent.focus(detachHandler);
	fireEvent.keyDown(detachHandler, { key: ' ' });
	const detachIcon = getByTestId(detachIconStr);
	debug();
	expect(detachIcon.className).toContain('sidebarDetached');
});

test('detach-icon should contains correct className when detach-handler div is key pressed with other keys rather than "Space" and "Enter"', async () => {
	const { getByTestId, debug } = render(<HeaderSecond />);
	const detachHandler = getByTestId('detach-handler');
	fireEvent.focus(detachHandler);
	fireEvent.keyDown(detachHandler, { key: 'Tab' });
	const detachIcon = getByTestId(detachIconStr);
	debug();
	expect(detachIcon.className).not.toContain('sidebarDetached');
});
