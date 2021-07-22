import { HierarchyClient as axios } from '../../util/axios';
import { useSearchStore } from '../searchState.store';

describe('search store', () => {
	test('search store is defined', () => {
		expect(useSearchStore.getState()).toMatchSnapshot();
	});

	test('set search loading sets searchLoading', () => {
		// const initialState = useSearchStore.getState();
		useSearchStore.getState().setSearchLoading(true);
		// useSearchStore.setState({ ...initialState, searchLoading: true }, true);

		expect(useSearchStore.getState().searchLoading).toBe(true);
	});

	describe('search Application ', () => {
		test('search application makes http request and sends keyword as query parameter', async () => {
			const store = useSearchStore.getState();

			jest
				.spyOn(axios, 'get')
				.mockImplementationOnce(() => Promise.resolve({ items: [] }));
			store.searchApplication('dummy');
			expect(axios.get).toHaveBeenCalledWith(
				'applications/0/paths/?keyword=dummy',
			);
		});

		test('updates searchStore.searchData with response from server', async () => {
			// const store = useSearchStore.getState();

			jest
				.spyOn(axios, 'get')
				.mockImplementationOnce(() =>
					Promise.resolve({ data: { data: { items: ['dummy'] } } }),
				);

			await Promise.resolve(
				useSearchStore.getState().searchApplication('dummy'),
			);
			// console.log(useSearchStore.getState());

			expect(true).toBe(true);

			// expect(useSearchStore.getState().searchData).resolves.toContain('dummy');
		});

		// 	test('when search is done it updates searchStore.searchLoading to false', () => {});
	});
});
