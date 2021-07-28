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
				applicationGroupId: null,
				applicationGroupName: null,
				_links: null,
			},
		],
		_links: null,
	},
	{
		path: [
			{
				id: 1,
				key: 'dc91a61c-5ab0-e711-8b81-005056b80f19',
				name: 'E2E Group',
				value: 'wqq',
				applicationGroupId: null,
				applicationGroupName: null,
				_links: null,
			},
			{
				id: 157,
				key: '3e5571a4-1519-4cc5-a72c-abf0cf05cdbb',
				name: 'Application 43',
				value: 'Application 43',
				applicationGroupId: null,
				applicationGroupName: null,
				_links: null,
			},
			{
				id: 164,
				key: 'c52374c4-5e25-4315-8a70-75450007ae94',
				name: 'Child Child Group',
				value: 'Child',
				applicationGroupId: null,
				applicationGroupName: null,
				_links: null,
			},
		],
		_links: null,
	},
	{
		path: [
			{
				id: 1,
				key: 'dc91a61c-5ab0-e711-8b81-005056b80f19',
				name: 'E2E Group',
				value: 'wqq',
				applicationGroupId: null,
				applicationGroupName: null,
				_links: null,
			},
			{
				id: 610,
				key: '7e221927-2b5b-474b-ad34-ea9cfce444d7',
				name: 'DemoGroup-',
				value: 'G66',
				applicationGroupId: null,
				applicationGroupName: null,
				_links: null,
			},
		],
		_links: null,
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
