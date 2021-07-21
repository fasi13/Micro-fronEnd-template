import { useSearchStore } from '../searchState.store';

const { setSearchLoading } = useSearchStore();
describe('adds 1 + 2 to equal 3', () => {
	it('should contain a function', () => {
		expect(setSearchLoading).toBe('function');
		expect(true).toBe(true);
	});
});
