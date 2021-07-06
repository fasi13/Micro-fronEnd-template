import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { OrbitSVG } from './Breadcrumb';

test('OrbitSVG contains correct className when true is passed to detachSidebar prop', () => {
	const { getByTestId } = render(<OrbitSVG detachSidebar />);
	const detachIcon = getByTestId('detach-icon');
	expect(detachIcon.className).toContain('sidebarDetached');
});
