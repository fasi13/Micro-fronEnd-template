import { render } from '@testing-library/react';
import React from 'react';
import { ContentMgtIcon } from '../index';

test('It should render contentMgtIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(
			<ContentMgtIcon className="" width={size.width} height={size.height} />,
		),
	).toMatchSnapshot();
});
