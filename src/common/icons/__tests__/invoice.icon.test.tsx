import { render } from '@testing-library/react';
import React from 'react';
import { InvoiceIcon } from '../index';

test('It should render InvoiceIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(
			<InvoiceIcon className="" width={size.width} height={size.height} />,
		),
	).toMatchSnapshot();
});
