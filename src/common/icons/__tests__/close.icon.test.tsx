import { render } from '@testing-library/react';
import React from 'react';
import { CloseIcon } from '../index';

test('It should render CloseIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(<CloseIcon className="" width={size.width} height={size.height} />),
	).toMatchSnapshot();
});
