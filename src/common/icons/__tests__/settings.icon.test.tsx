import { render } from '@testing-library/react';
import React from 'react';
import { SettingsIcon } from '../index';

test('It should render SettingsIcon', async () => {
	const size = { width: 512, height: 512 };

	render(<SettingsIcon className="" width={size.width} height={size.height} />);
});
