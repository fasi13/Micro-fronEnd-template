import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import App from './App';

test('loads and displays App', () => {
	const { container, getByTestId, getByText, queryByTestId } = render(<App />);
	const logo = getByTestId('logo', { exact: true });
	const p = getByTestId('message');

	getByText('get started', { exact: false });
	expect(logo).toBeInTheDocument();
	expect(p).toBeInTheDocument();
	expect(queryByTestId('learn-link')).toBeInTheDocument();
});
