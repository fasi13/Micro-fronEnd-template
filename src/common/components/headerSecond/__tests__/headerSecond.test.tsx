import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Home } from '../../../../pages/home/home';
import { useDetachStore } from '../../../../state';
import { HierarchyClient } from '../../../../util/axios';
import { HeaderSecond } from '../headerSecond';

const detachIconStr = 'detach-icon';
const dSSidebarState = useDetachStore.getState();
const detachHandlerStr = 'detach-handler';
test('renders home component', () => {
	render(<HeaderSecond />);
});

test(' detached sidebar should be displayed when detachSidebar global state is assigned to true', () => {
	jest.spyOn(HierarchyClient, 'get').mockResolvedValueOnce(null);
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	expect(Rnd).toBeInTheDocument();
});

test('detach-icon should contains correct className when detachSidebar (global state) is assigned to be true', () => {
	dSSidebarState.setDetachSidebar(true);
	jest.spyOn(HierarchyClient, 'get').mockResolvedValueOnce(null);
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
	const { getByTestId } = render(<HeaderSecond />);
	const detachHandler = getByTestId(detachHandlerStr);
	fireEvent.keyDown(detachHandler, { key: 'Enter' });
	const detachIcon = getByTestId(detachIconStr);
	expect(detachIcon.className).toContain('sidebarDetached');
});

test('detach-icon should contains correct className when detach-handler div is key pressed with other keys rather than "Space" and "Enter"', async () => {
	const { getByTestId } = render(<HeaderSecond />);
	const detachHandler = getByTestId(detachHandlerStr);
	fireEvent.keyDown(detachHandler, { key: 'Tab' });
	const detachIcon = getByTestId(detachIconStr);
	expect(detachIcon.className).not.toContain('sidebarDetached');
});

test('Clicking on detach-icon after detached sidebar should close the sidebar modal ', async () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<HeaderSecond />);
	const detachHandler = getByTestId(detachHandlerStr);
	fireEvent.click(detachHandler);
	expect(dSSidebarState.detachSidebar).not.toBeTruthy();
});
