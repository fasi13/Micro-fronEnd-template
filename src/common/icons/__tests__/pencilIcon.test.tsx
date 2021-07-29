import { render } from '@testing-library/react';
import React from 'react';
import { PencilIcon } from '../index';

test('It should render addicon', async () => {
	const size = { width: 512, height: 512 };

	render(<PencilIcon className="" width={size.width} height={size.height} />);
});
