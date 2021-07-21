import '@testing-library/jest-dom';
import React from 'react';

import { render } from '@testing-library/react';
import { Sidebar } from '../sidebar';

test('renders sidebar component', () => {
	render(<Sidebar />);
});
