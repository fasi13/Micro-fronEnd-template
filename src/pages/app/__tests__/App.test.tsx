import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import App from '../app';

describe('App', () => {
	test('renders App component', () => {
		render(<App />);
	});

	// test('loads and displays App', () => {
	// 	const { getByTestId, getByText, queryByTestId } = render(<App />);
	// 	const p = getByTestId('message');

	// 	getByText('get started', { exact: false });
	// 	expect(p).toBeInTheDocument();
	// 	expect(queryByTestId('learn-link')).toBeInTheDocument();
	// });
});
