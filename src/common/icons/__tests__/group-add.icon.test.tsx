import { render } from '@testing-library/react';
import React from 'react';
import { GroupAddIcon } from '../index';

test('It should render GroupAddIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(
			<GroupAddIcon className="" width={size.width} height={size.height} />,
		),
	).toMatchSnapshot();
});
