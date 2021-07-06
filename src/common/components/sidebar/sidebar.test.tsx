import '@testing-library/jest-dom';
import React from 'react';
import { create } from 'react-test-renderer';
import Sidebar from './sidebar';

it('renders', () => {
	const tree = create(<Sidebar />).toJSON;
	expect(tree).toMatchSnapshot();
});
