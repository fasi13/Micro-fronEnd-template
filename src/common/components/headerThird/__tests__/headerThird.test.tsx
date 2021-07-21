import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { detachStore } from '../../../../state';
import { HeaderThird } from '../headerThird';

const dSSidebarState = detachStore.getState();
test('renders home component', () => {
	render(<HeaderThird />);
});

test('arrow-back icon should be displayed when sidebar open global state is assigned to true', () => {
	dSSidebarState.setOpen(true);
	const { getByTestId } = render(<HeaderThird />);
	const Rnd = getByTestId('arrow-back');
	expect(Rnd).toBeInTheDocument();
});
test('arrow-forward icon  should be displayed when sidebar open global state is assigned to false', () => {
	dSSidebarState.setOpen(false);
	const { getByTestId } = render(<HeaderThird />);
	const Rnd = getByTestId('arrow-forward');
	expect(Rnd).toBeInTheDocument();
});

test('drawer must toggle when drawer open/close icon is clicked', () => {
	dSSidebarState.setOpen(false);
	const { getByTestId } = render(<HeaderThird />);
	const drawerOpen = getByTestId('drawer-open');
	fireEvent.click(drawerOpen);
	expect(dSSidebarState.open).toBeTruthy();
});

test('drawer must toggle when drawer open/close icon is pressed on keyDown using "enter" key', () => {
	dSSidebarState.setOpen(false);
	const { getByTestId } = render(<HeaderThird />);
	const drawerOpen = getByTestId('drawer-open');
	fireEvent.keyDown(drawerOpen, { key: 'Enter', code: 13 });
	expect(dSSidebarState.open).toBeTruthy();
});
