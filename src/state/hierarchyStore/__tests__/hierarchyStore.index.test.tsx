import * as hierarhcyStoreExports from '../index';

describe('hierarhcy imports', () => {
	it('re-exports the following items', () => {
		expect(hierarhcyStoreExports).toMatchSnapshot();
	});
});
