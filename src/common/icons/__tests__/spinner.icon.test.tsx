import { render } from '@testing-library/react';
import React from 'react';
import { SpinnerIcon } from '../index';

test('It should render SpinnerIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(
			<SpinnerIcon className="" width={size.width} height={size.height} />,
		),
	).toMatchSnapshot();
});
