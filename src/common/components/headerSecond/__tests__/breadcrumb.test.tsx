import '@testing-library/jest-dom/extend-expect';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import React from 'react';
import { useBreadcrumbStore } from '../../../../state';
import { NodePath } from '../../../../types';
import Breadcrumb from '../breadcrumb';

const pathData: NodePath[] = [
	{ pathId: 1, pathName: 'E2E Group' },
	{ pathId: 13, pathName: 'New Application Group' },
	{ pathId: 14, pathName: 'New Group2' },
	{ pathId: 15, pathName: 'New Application' },
];

describe('Breadcrumb', () => {
	beforeEach(() => {
		act(async () => {
			await waitFor(() =>
				useBreadcrumbStore.setState({ breadCrumbData: pathData }),
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

	test('Breadcrumb check for correct classnames', () => {
		render(<Breadcrumb />);
		expect(screen.getAllByRole('button')[0].className).toContain('first');
		expect(screen.getAllByRole('button')[1].className).toContain('link');
		expect(screen.getByTestId('disabledBreadLink').className).toContain('last');
	});

	test('Breadcrumb click event breadcrumb state check', () => {
		render(<Breadcrumb />);
		expect(screen.getByTestId('breadcrumbtest')).toBeInTheDocument();
		fireEvent.click(screen.getAllByRole('button')[0]);
		expect(useBreadcrumbStore.getState().breadCrumbData.length).toBe(1);
	});
});
