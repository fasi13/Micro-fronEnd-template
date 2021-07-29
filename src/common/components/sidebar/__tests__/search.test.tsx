/* eslint-disable sonarjs/no-duplicate-string */
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useSearchStore } from '../../../../state/searchState.store';
import { ApplicationPath } from '../../../../types';
import { Sidebar } from '../sidebar';

const mockSearchData: ApplicationPath[] = [
	{
		path: [
			{
				id: 1,
				key: 'dc91a61c-5ab0-e711-8b81-005056b80f19',
				name: 'E2E Group',
				value: 'wqq',
				_links: [
					{
						rel: 'self',
						method: {
							method: 'GET',
						},
						href: 'https://qa-hierarchy-api.cxsrecognize.com/applications/2',
						name: 'Application 12ED test',
					},
				],
			},
		],
		_links: [
			{
				rel: 'self',
				method: {
					method: 'GET',
				},
				href: 'https://qa-hierarchy-api.cxsrecognize.com/applications/2',
				name: 'Application 12ED test',
			},
		],
	},
];

describe('Autocomplete Search', () => {
	test('Render autocomplete search', async () => {
		const { getByTestId, getByRole } = render(<Sidebar />);

		const inputSearchField = getByTestId('searchfield');
		const inputField = getByRole('textbox');
		expect(getByTestId('searchautocomplete')).toBeInTheDocument();
		expect(inputSearchField).toBeInTheDocument();
		expect(inputField).toBeInTheDocument();
		expect(inputField).toHaveAttribute('type', 'text');
	});

	test('It should allow search keyword to be inputted', async () => {
		const { getByRole, queryByRole } = render(<Sidebar />);

		expect(queryByRole('listbox')).toBeNull();
		const inputField = getByRole('textbox');

		userEvent.type(inputField, 'group');

		expect(inputField).toHaveValue('group');
		// debug()

		useSearchStore.setState({ searchData: mockSearchData });

		const ListBox = getByRole('listbox');
		expect(ListBox).toBeDefined();
		// await waitFor(() => expect(getByRole('listbox')).toBeDefined())
	});
});
