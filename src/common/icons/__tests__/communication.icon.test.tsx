import { render } from '@testing-library/react';
import React from 'react';
import { CommunicationIcon } from '../index';

test('It should render communicationIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(
			<CommunicationIcon
				className=""
				width={size.width}
				height={size.height}
			/>,
		),
	).toMatchSnapshot();
});
