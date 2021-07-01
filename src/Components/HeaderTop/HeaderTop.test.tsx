import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import HeaderTop from './HeaderTop';

test('renders App component', () => {
	render(<HeaderTop />);
});
