import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import {
	SearchApplication,
	SearchApplicationProps,
} from './search-application';
import { getApplicationPath } from './utils';

const crateApplicationGroup = 'Create Application Group';
const pathName = 'Application 12ED test';
const pathLink2 =
	'https://qa-hierarchy-api.cxsrecognize.com/applications/2/applicationGroups';
const actionName = 'Application Groups';

const data: SearchApplicationProps = {
	item: {
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
						name: crateApplicationGroup,
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
			{
				id: 2,
				key: 'e9cc14a8-0f2a-4b1f-863b-60de05df800c',
				name: 'Application 12ED test',
				value: 'Value application 12ED',
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
						name: crateApplicationGroup,
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
				name: crateApplicationGroup,
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
	const { queryByText, debug } = render(<SearchApplication item={data.item} />);
	debug();
	expect(queryByText(/wqq/i)).toBeInTheDocument();
	expect(queryByText(/Value application 12ED/i)).toBeInTheDocument();
});

test('get application path', () => {
	const result = getApplicationPath(data.item);
	expect(result).toBe('wqq');
});
