import '@testing-library/jest-dom/extend-expect';
import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import React from 'react';
import { useBreadcrumbStore } from '../../../../state';
import { NodePath } from '../../../../types';
import Breadcrumb from '../breadcrumb';

const pathData2: NodePath[] = [
	{ pathId: 1, pathName: 'E2E Group' },
	{ pathId: 13, pathName: 'Application00' },
	{ pathId: 14, pathName: 'Application0' },
	{ pathId: 15, pathName: 'Application1' },
	{ pathId: 16, pathName: 'Application2' },
	{ pathId: 17, pathName: 'Application3' },
	{ pathId: 18, pathName: 'Application4' },
	{ pathId: 19, pathName: 'Application5' },
	{ pathId: 20, pathName: 'Application6' },
	{ pathId: 21, pathName: 'Application7' },
];

describe('Breadcrumb', () => {
	beforeEach(() => {
		act(async () => {
			await waitFor(() =>
				useBreadcrumbStore.setState({ breadCrumbData: pathData2 }),
			);
		});
	});

	test('Breadcrumb renders with correct text', () => {
		render(<Breadcrumb />);
		const elt = screen.getByTestId('breadcrumbtest');
		expect(elt).toBeInTheDocument();
		expect(elt).toHaveTextContent('E2E Group');
		expect(elt).toHaveTextContent('/');
	});

	test('Breadcrumb renders E2E Group with disabled paragraph', () => {
		render(<Breadcrumb />);
		expect(screen.getByTestId('disabledBreadLink').closest('p'));
	});

	test('Breadcrumb click event breadcrumb state check', () => {
		render(<Breadcrumb />);
		expect(screen.getByTestId('breadcrumbtest')).toBeInTheDocument();
		fireEvent.click(screen.getAllByRole('button')[0]);
		expect(useBreadcrumbStore.getState().breadCrumbData.length).toBe(1);
	});

	test('Breadcrumb check full path output', () => {
		render(<Breadcrumb />);
	});
});
