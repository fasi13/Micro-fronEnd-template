/* eslint-disable sonarjs/no-duplicate-string */
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { useSearchStore } from '../../../../state/searchState.store';
import { ApplicationPath } from '../../../../types';
import Searchbar from '../Searchbar';
import { getApplicationName } from '../utils';

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
		const { getByTestId, getByRole } = render(<Searchbar />);

		const inputSearchField = getByTestId('searchfield');
		const inputField = getByRole('textbox');
		expect(getByTestId('searchautocomplete')).toBeInTheDocument();
		expect(inputSearchField).toBeInTheDocument();
		expect(inputField).toBeInTheDocument();
		expect(inputField).toHaveAttribute('type', 'text');
	});

	test('It should allow search keyword to be inputted', async () => {
		const { getByRole, queryByRole, getByTestId } = render(<Searchbar />);

		expect(queryByRole('listbox')).toBeNull();
		const inputField = getByRole('textbox');

		userEvent.type(inputField, 'group');

		expect(inputField).toHaveValue('group');

		useSearchStore.setState({ searchData: mockSearchData });

		const ListBox = getByRole('listbox');
		expect(ListBox).toBeDefined();
		expect(getByTestId('searchresult-list')).toBeInTheDocument();
	});

	test('Search loading - false', async () => {
		const { queryByTestId } = render(<Searchbar />);
		useSearchStore.setState({ searchLoading: false });
		expect(queryByTestId('searchfield-progress')).not.toBeInTheDocument();
	});

	test('Search loading - true', async () => {
		const { getByTestId } = render(<Searchbar />);
		useSearchStore.setState({ searchLoading: true });
		expect(getByTestId('searchfield-progress')).toBeInTheDocument();
	});
});

describe('get Application Name', () => {
	const dummyPath: ApplicationPath = {
		path: [
			{
				id: 1,
				key: 'dc91a61c-5ab0-e711-8b81-005056b80f19',
				name: 'E2E Group ',
				value: '1',
				_links: [],
			},
			{
				id: 2,
				key: 'e9cc14a8-0f2a-4b1f-863b-60de05df800c',
				name: 'Application 12ED test',
				value: 'Value application 12EG',

				_links: [],
			},
		],
		_links: [],
	};
	test('should get application name', () => {
		const applicationName = getApplicationName({ ...dummyPath });
		expect(applicationName).toBe('Application 12ED test');
	});
});
