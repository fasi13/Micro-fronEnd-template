import { render } from '@testing-library/react';
import React from 'react';
import { PencilIcon } from '../index';

test('It should render pencilIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(<PencilIcon className="" width={size.width} height={size.height} />),
	).toMatchSnapshot();
});
