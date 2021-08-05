import { render } from '@testing-library/react';
import React from 'react';
import { UserMgtIcon } from '../index';

test('It should render UserMgtIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(
			<UserMgtIcon className="" width={size.width} height={size.height} />,
		),
	).toMatchSnapshot();
});
