import { render } from '@testing-library/react';
import React from 'react';
import { ClientMgtIcon } from '../clientMgt.icon';

test('It should render clientMgtIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(
			<ClientMgtIcon className="" width={size.width} height={size.height} />,
		),
	).toMatchSnapshot();
});
