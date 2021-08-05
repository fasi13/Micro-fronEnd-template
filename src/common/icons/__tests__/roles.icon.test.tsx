import { render } from '@testing-library/react';
import React from 'react';
import { RolesIcon } from '../index';

test('It should render rolesIcon', async () => {
	const size = { width: 512, height: 512 };

	render(<RolesIcon className="" width={size.width} height={size.height} />);
});
