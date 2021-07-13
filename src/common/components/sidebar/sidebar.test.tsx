import '@testing-library/jest-dom';
import React from 'react';
import { create } from 'react-test-renderer';
import { Sidebar } from './sidebar';

test('renders', () => {
	const tree = create(<Sidebar />).toJSON;
	expect(tree).toMatchSnapshot();
});
