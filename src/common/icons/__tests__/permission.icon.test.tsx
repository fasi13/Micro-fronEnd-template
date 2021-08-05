import { render } from '@testing-library/react';
import React from 'react';
import { PermissionIcon } from '../index';

test('It should render permissionIcon', async () => {
	const size = { width: 512, height: 512 };

	render(
		<PermissionIcon className="" width={size.width} height={size.height} />,
	);
});
