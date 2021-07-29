import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Sidebar } from '../sidebar';

test('renders sidebar component', () => {
	act(() => {
		const { debug } = render(<Sidebar />);
		debug();
	});
});


