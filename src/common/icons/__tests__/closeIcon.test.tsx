import { render } from '@testing-library/react';
import React from 'react';
import { CloseIcon } from '../index';

test('It should render closeicon', async () => {
	const size = { width: 329, height: 329 };

	render(<CloseIcon className="" width={size.width} height={size.height} />);
});
