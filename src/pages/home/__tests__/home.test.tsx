import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import { useDetachStore } from '../../../state';
import { HierarchyClient } from '../../../util/axios';
import { Home } from '../home';

const dSSidebarState = useDetachStore.getState();
const closeDetachedSidebarStr = 'close-detached-sidebar';
test('renders home component', () => {
	render(<Home />);
});

test(' detached sidebar should be displayed when detachSidebar global state is assigned to true', () => {
	jest.spyOn(HierarchyClient, 'get').mockResolvedValue(null);
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

test('detached sidebar should be closed when close icon is clicked', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	const closeDetachedSidebar = getByTestId(closeDetachedSidebarStr);
	user.click(closeDetachedSidebar);
	expect(Rnd).not.toBeInTheDocument();
});

test('detached sidebar should be closed closed when close icon is pressed on Enter with other characters', () => {
	dSSidebarState.setDetachSidebar(true);
	const { getByTestId } = render(<Home />);
	const Rnd = getByTestId('rnd');
	const closeDetachedSidebar = getByTestId(closeDetachedSidebarStr);
	fireEvent.keyDown(closeDetachedSidebar, '{enter}');
	expect(Rnd).toBeInTheDocument();
});
