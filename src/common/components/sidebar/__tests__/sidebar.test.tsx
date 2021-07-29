import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { Sidebar } from '../sidebar';

test('renders sidebar component', () => {
	render(<Sidebar />);
});


