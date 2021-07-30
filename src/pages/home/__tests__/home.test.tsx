import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import { detachStore } from '../../../state';
import { Home } from '../home';

const dSSidebarState = detachStore.getState();
const closeDetachedSidebarStr = 'close-detached-sidebar';
test('renders home component', () => {
	render(<Home />);
});

test(' detached sidebar should be displayed when detachSidebar global state is assigned to true', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	expect(Rnd).toBeInTheDocument();
});

test('detached sidebar should be closed when close icon is clicked', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	const closeDetachedSidebar = getByTestId(closeDetachedSidebarStr);
	fireEvent.click(closeDetachedSidebar);
	expect(Rnd).not.toBeInTheDocument();
});

test('detached sidebar should be closed when close icon is on key press event with "Enter" key', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	const closeDetachedSidebar = getByTestId(closeDetachedSidebarStr);
	fireEvent.keyDown(closeDetachedSidebar, { key: 'Enter' });
	expect(Rnd).not.toBeInTheDocument();
});

test('detached sidebar should be closed when close icon is clicked', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	const closeDetachedSidebar = getByTestId(closeDetachedSidebarStr);
	user.click(closeDetachedSidebar);
	expect(Rnd).not.toBeInTheDocument();
});

test('detached sidebar should be closed when close icon is pressed on keyDown with other characters', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	const closeDetachedSidebar = getByTestId(closeDetachedSidebarStr);
	user.type(closeDetachedSidebar, '{tab}');
	expect(Rnd).not.toBeInTheDocument();
});
