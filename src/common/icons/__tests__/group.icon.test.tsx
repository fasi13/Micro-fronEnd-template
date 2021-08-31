import { render } from '@testing-library/react';
import React from 'react';
import { GroupIcon } from '../index';

test('It should render GroupAddIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(<GroupIcon className="" width={size.width} height={size.height} />),
	).toMatchSnapshot();
});
