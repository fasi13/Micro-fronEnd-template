import '@testing-library/jest-dom';
import { create } from 'react-test-renderer';
import React from 'react';
import Sidebar from './Sidebar';

it('renders', () => {
	const tree = create(<Sidebar />).toJSON;
	expect(tree).toMatchSnapshot();
});
