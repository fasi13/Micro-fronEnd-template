import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import {
	SearchApplication,
	SearchApplicationProps,
} from './search-application';

const pathName = 'Application 12ED test';
const pathValue = 'Value application 12ED Path';
const pathLink2 =
	'https://qa-hierarchy-api.cxsrecognize.com/applications/2/applicationGroups';
const actionName = 'Application Groups';

const data: SearchApplicationProps = {
	item: {
		path: [
			{
				id: 2,
				key: 'e9cc14a8-0f2a-4b1f-863b-60de05df800c',
				name: pathName,
				value: pathValue,
				_links: [
					{
						rel: 'self',
						method: {
							method: 'GET',
						},
						href: pathLink2,
						name: pathName,
					},
					{
						rel: 'updateApplication',
						method: {
							method: 'PUT',
						},
						href: 'link',
						name: pathName,
					},
					{
						rel: 'applicationGroups',
						method: {
							method: 'GET',
						},
						href: pathLink2,
						name: actionName,
					},
					{
						rel: 'createApplicationGroup',
						method: {
							method: 'POST',
						},
						href: pathLink2,
						name: 'Create Application Group',
					},
					{
						rel: 'path',
						method: {
							method: 'GET',
						},
						href: pathLink2,
						name: 'Path',
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
				name: pathName,
			},
			{
				rel: 'updateApplication',
				method: {
					method: 'PUT',
				},
				href: 'https://qa-hierarchy-api.cxsrecognize.com/applications/2',
				name: pathName,
			},
			{
				rel: 'applicationGroups',
				method: {
					method: 'GET',
				},
				href: pathLink2,
				name: actionName,
			},
			{
				rel: 'createApplicationGroup',
				method: {
					method: 'POST',
				},
				href: pathLink2,
				name: 'Create Application Group',
			},
			{
				rel: 'path',
				method: {
					method: 'GET',
				},
				href: pathLink2,
				name: 'Path',
			},
		],
	},
};

test('search application testing ', () => {
	const { queryByText } = render(<SearchApplication item={data.item} />);
	expect(queryByText(pathValue)).toBeInTheDocument();
});
