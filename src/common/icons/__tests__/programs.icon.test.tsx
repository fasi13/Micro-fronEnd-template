import { render } from '@testing-library/react';
import React from 'react';
import { ProgramsIcon } from '../index';

test('It should render ProgramsIcon', async () => {
	const size = { width: 512, height: 512 };

	render(<ProgramsIcon className="" width={size.width} height={size.height} />);
});
