import '@testing-library/jest-dom/extend-expect';
import {
	fireEvent,
	getByRole as globalGetByRole,
	getByText as globalGetByText,
	render,
} from '@testing-library/react';
import React from 'react';
import { useSearchStore } from '../../../state';
import { Sidebar } from './sidebar';

// test("Search ui renders with correctly", () => {
//   const component = render(<Sidebar />)
//   const searchEl = component.getByTestId("searchautocomplete")
//   expect(searchEl.textContent).toBe("E2E Group")
// })

test('that autocomplete works', async () => {
	const { searchData } = useSearchStore.getState();

	const { getByTestId, getByRole, queryByRole } = render(<Sidebar />, {});

	const AutoCompleteSearch = getByTestId('searchautocomplete');
	const Input = globalGetByRole(AutoCompleteSearch, 'textbox');

	expect(queryByRole('listbox')).toBeNull();

	fireEvent.mouseDown(Input);
	const ListBox = getByRole('listbox');
	expect(ListBox).toBeDefined();
	const menuItem1 = globalGetByText(ListBox, searchData[0].path[0].name);
	fireEvent.click(menuItem1);
	expect(queryByRole('listbox')).toBeNull();

	fireEvent.mouseDown(Input);
	const ListBoxAfter = getByRole('listbox');
	expect(ListBoxAfter).toBeDefined();
	const menuItem2 = globalGetByText(ListBoxAfter, searchData[1].path[1].name);
	fireEvent.click(menuItem2);
	expect(queryByRole('listbox')).toBeNull();
});
