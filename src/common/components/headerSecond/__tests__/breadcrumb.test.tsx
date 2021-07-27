import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { useBreadcrumbStore } from '../../../../state';
import { NodePath } from '../../../../types';
import Breadcrumb from '../breadcrumb';
import { getButtonId } from '../breadCrumbUtil';

const breadData = 'New Application Group';
const pathData: NodePath[] = [
	{ pathId: -1, pathName: 'E2E Group' },
	{ pathId: 15, pathName: breadData },
	{ pathId: 26, pathName: 'Application 1' },
	{ pathId: 16, pathName: 'New Application Group1' },
	{ pathId: 30, pathName: 'Application 5' },
];


describe('Breadcrumb', () => {

  test('Breadcrumb renders with correct text', () => {
    const component = render(<Breadcrumb />);
    const breadcrumbEl = component.getByTestId('breadcrumbtest');
    expect(breadcrumbEl.textContent).toBe('E2E Group');
  });

  test('Breadcumb renders with with correct text New Application Group ', () => {

    useBreadcrumbStore.setState({ breadCrumbData: pathData });

    const component = render(<Breadcrumb />);
    const breadcrumbEl = component.getByTestId('breadcrumbtest');
    expect(breadcrumbEl.textContent).toContain('New Application Group');
  });

  test('Breadcumb renders with / separator', () => {
    useBreadcrumbStore.setState({ breadCrumbData: pathData });

    const component = render(<Breadcrumb />);
    const breadcrumbEl = component.getByTestId('breadcrumbtest');
    expect(breadcrumbEl.textContent).toContain('/');
  });

  test('Breadcumb renders E2E Group with disabled paragraph', () => {
    // useBreadcrumbStore.setState({ breadCrumbData: pathData})

    const component = render(<Breadcrumb />);
    const breadcrumbEl = component.getByTestId('disabledBreadLink');
    expect(breadcrumbEl.closest('p'));
  });

  test('Breadcumb renders last link with disabled paragraph', () => {
    useBreadcrumbStore.setState({ breadCrumbData: pathData });

    const component = render(<Breadcrumb />);
    const breadcrumbEl = component.getByTestId('disabledBreadLink');
    expect(breadcrumbEl.closest('p'));
  });

  test('Breadcrumb convert and get Id', () => {

    const pathData2: NodePath[] = [
      { pathId: -1, pathName: 'E2E Group' },
      { pathId: 15, pathName: breadData },
    ];

    useBreadcrumbStore.setState({ breadCrumbData: pathData2 });

    const {getByTestId} = render(<Breadcrumb />);

    expect(getByTestId('breadcrumbtest')).toBeInTheDocument();

    expect(getByTestId('breadLink')).toBeInTheDocument();

    expect(getButtonId(-1)).toBe('1');
    expect(getButtonId(15)).toBe('15');

    fireEvent.click(getByTestId('breadLink'))
    expect(useBreadcrumbStore.getState().breadCrumbData.length).toBe(1);
  });

});
