import { Link } from '../../../types';
import {
	getChildrenLink,
	getCreateApplicationLink,
	getCreateGroupLink,
	getSelfUpdateLink,
} from '../helpers/hierarchy.link.helper';

const selfupdateUrl = 'dummy/selfupdate';
const createGroupUrl = 'dummy/createGroup';
const createAppUrl = 'dummy/createApp';
const childrenAppUrl = 'dummy/children_application';
const childrenAppGroupUrl = 'dummy/children_applicationGroup';
const _links: Link[] = [
	{
		href: selfupdateUrl,
		method: { method: 'GET' },
		name: 'updateSelf',
		rel: 'updateApplicationGroup',
	},
	{
		href: selfupdateUrl,
		method: { method: 'GET' },
		name: 'updateSelf',
		rel: 'updateApplication',
	},
	{
		href: createGroupUrl,
		method: { method: 'POST' },
		name: 'createGroup',
		rel: 'createApplicationGroup',
	},
	{
		href: createAppUrl,
		method: { method: 'POST' },
		name: 'createApp',
		rel: 'createApplication',
	},
	{
		href: childrenAppUrl,
		method: { method: 'GET' },
		name: 'getChildren',
		rel: 'applications',
	},
	{
		href: childrenAppGroupUrl,
		method: { method: 'GET' },
		name: 'getChildren',
		rel: 'applicationGroups',
	},
];

describe('getSelfUpdateLink', () => {
	it('returns updateApplicationGroup self update link if isGroup param is true', () => {
		expect(getSelfUpdateLink(_links, true)).toMatchObject({
			href: selfupdateUrl,
			method: { method: 'GET' },
			name: 'updateSelf',
			rel: 'updateApplicationGroup',
		});
	});

	it('returns updateApplication self update link if isGroup param is false', () => {
		expect(getSelfUpdateLink(_links, false)).toMatchObject({
			href: selfupdateUrl,
			method: { method: 'GET' },
			name: 'updateSelf',
			rel: 'updateApplication',
		});
	});
});

describe('getCreateGroupLink', () => {
	it('returns a nodes createGroupLink', () => {
		expect(getCreateGroupLink(_links)).toMatchObject({
			href: createGroupUrl,
			method: { method: 'POST' },
			name: 'createGroup',
			rel: 'createApplicationGroup',
		});
	});
});

describe('getCreateApplicationLink', () => {
	it('returns a nodes createApplicationLink', () => {
		expect(getCreateApplicationLink(_links)).toMatchObject({
			href: createAppUrl,
			method: { method: 'POST' },
			name: 'createApp',
			rel: 'createApplication',
		});
	});
});

describe('getChildrenLink', () => {
	it('returns a nodes getChildrenLink', () => {
		expect(getChildrenLink(_links)).toMatchObject([
			{
				href: childrenAppUrl,
				method: { method: 'GET' },
				name: 'getChildren',
				rel: 'applications',
			},
			{
				href: childrenAppGroupUrl,
				method: { method: 'GET' },
				name: 'getChildren',
				rel: 'applicationGroups',
			},
		]);
	});
});
