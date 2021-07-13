import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { Home } from './home';

test('renders home component', () => {
	render(<Home />);
});
