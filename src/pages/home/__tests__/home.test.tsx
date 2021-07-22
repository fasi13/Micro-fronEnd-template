import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import { detachStore } from '../../../state';
import { Home } from '../home';

const dSSidebarState = detachStore.getState();

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
	const closeDetachedSidebar = getByTestId('close-detached-sidebar');
	fireEvent.click(closeDetachedSidebar);
	expect(Rnd).not.toBeInTheDocument();
});

test('detached sidebar should be closed when close icon is pressed on keyDown', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	user.type(Rnd, '{enter}');
	const closeDetachedSidebar = getByTestId('close-detached-sidebar');
	fireEvent.keyDown(closeDetachedSidebar, { key: 'Enter', code: 13 });
	expect(Rnd).toBeInTheDocument();
});
