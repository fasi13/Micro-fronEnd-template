import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import {
	SearchApplication,
	SearchApplicationProps,
} from '../search-application';
import {
	getApplicationPath,
	getApplicationValue,
	getElementId,
	getSeparator,
} from '../utils';

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
				value: 'E2E Group',
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
				name: pathName,
				value: pathName,
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
				href: 'https://qa-hierarchy-api.cxsrecognize.com/applications/3',
				name: pathName,
			},
			{
				rel: 'updateApplication',
				method: {
					method: 'PUT',
				},
				href: 'https://qa-hierarchy-api.cxsrecognize.com/applications/4',
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
const singlePath: SearchApplicationProps = {
	item: {
		path: [
			{
				id: 1,
				key: 'dc91a61c-5ab0-e711-8b81-005056b80f192',
				name: 'E2E Group',
				value: 'Group-App-Name',
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
				href: 'https://qa-hierarchy-api.cxsrecognize.com/applications/5',
				name: pathName,
			},
			{
				rel: 'updateApplication',
				method: {
					method: 'PUT',
				},
				href: 'https://qa-hierarchy-api.cxsrecognize.com/applications/6',
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
	const { queryByText } = render(<SearchApplication item={data.item} />);
	expect(queryByText(/E2E Group/i)).toBeInTheDocument();
});
test('should get Group App Name ', () => {
	expect(getApplicationPath(data.item)).toBe('E2E Group');
});
test('should not get Group App Name ', () => {
	expect(getApplicationPath(singlePath.item)).not.toBe('Group-App-Name');
});
test('should not return >', () => {
	const mockArray = {
		mockPath: [
			{
				id: 1,
			},
		],
	};

	const result = getSeparator(0, mockArray.mockPath);
	expect(result).not.toBe('>');
});
test('should return >', () => {
	const mockMultipleArray = {
		mockPath: [
			{
				id: 1,
			},
			{
				id: 2,
			},
		],
	};

	const result = getSeparator(0, mockMultipleArray.mockPath);
	expect(result).toBe('>');
});

test('should return element id ', () => {
	const mockMultipleArray = {
		mockPath: [
			{
				id: 1,
				key: 'dc91a61c-5ab0-e711-8b81-005056b80f192e',
				name: 'E2E Group',
				value: 'GroupAppName',
				applicationGroupId: null,
			},
		],
	};
	const result = getElementId(mockMultipleArray.mockPath[0]);
	expect(result).not.toBe('GroupAppName');
});
test('should return null ', () => {
	const mockMultipleArray = {
		mockPath: [
			{
				id: 1,
				key: 'dc91a61c-5ab0-e711-8b81-005056b80f19f',
				name: 'E2E Group',
				value: '',
				applicationGroupId: null,
			},
		],
	};
	const result = getElementId(mockMultipleArray.mockPath[0]);
	expect(result).toBe('()');
});
test('should return null', () => {
	const mockMultipleArray = {
		mockPath: [
			{
				id: 2,
				key: 'dc91a61c-5ab0-e711-8b81-005056b80f19d',
				name: 'E2E Group',
				value: '',
				applicationGroupId: null,
			},
		],
	};

	const result = getElementId(mockMultipleArray.mockPath[0]);
	expect(result).not.toBe('GroupAppName');
});

test('should remove application value if its identical with application Name', () => {
	expect(getApplicationValue(data.item)).toBeNull();
});
