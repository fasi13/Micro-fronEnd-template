import { render } from '@testing-library/react';
import React from 'react';
import { PriceIcon } from '../index';

test('It should render priceICon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(<PriceIcon className="" width={size.width} height={size.height} />),
	).toMatchSnapshot();
});
