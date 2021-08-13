import { render } from '@testing-library/react';
import React from 'react';
import { FolderIcon } from '../index';

test('It should render folderIcon', async () => {
	const size = { width: 512, height: 512 };

	expect(
		render(<FolderIcon className="" width={size.width} height={size.height} />),
	).toMatchSnapshot();
});
