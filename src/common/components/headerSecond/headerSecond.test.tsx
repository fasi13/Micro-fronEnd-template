import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Home } from '../../../pages/home/home';
import { detachStore } from '../../../state';
import { Breadcrumb } from './headerSecond';

const detachIconStr = 'detach-icon';
const dSSidebarState = detachStore.getState();
test('renders home component', () => {
	render(<Breadcrumb />);
});

test(' detached sidebar should be displayed when detachSidebar global state is assigned to true', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	expect(Rnd).toBeInTheDocument();
});

test('detach-icon should contains correct className when detachSidebar (global state) is assigned to be true', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Breadcrumb />);
	const detachIcon = getByTestId(detachIconStr);
	expect(detachIcon.className).toContain('sidebarDetached');
});

test('detach-icon should contains correct className when detachSidebar (global state) is assigned to be false', () => {
	dSSidebarState.setDetachSidebar(false);
	const { getByTestId } = render(<Breadcrumb />);
	const detachIcon = getByTestId(detachIconStr);
	expect(detachIcon.className).not.toContain('sidebarDetached');
});

test('detach-icon should contains correct className when detach-handler div is clicked', () => {
	const { getByTestId } = render(<Breadcrumb />);
	const detachHandler = getByTestId('detach-handler');
	fireEvent.click(detachHandler);
	const detachIcon = getByTestId(detachIconStr);
	expect(detachIcon.className).toContain('sidebarDetached');
});

test('detach-icon should contains correct className when detach-handler div is on key-down event', () => {
	const { getByTestId } = render(<Breadcrumb />);
	const detachHandler = getByTestId('detach-handler');
	fireEvent.keyDown(detachHandler);
	const detachIcon = getByTestId(detachIconStr);
	expect(detachIcon.className).toContain('sidebarDetached');
});
