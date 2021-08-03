import { ApplicationPath } from '../../types';
import { HierarchyClient as axios } from '../../util/axios';
import { useSearchStore } from '../searchState.store';

describe('search state store', () => {
	it('search store is defined', () => {
		useSearchStore.getState().setSearchLoading(true);
		expect(useSearchStore.getState().searchLoading).toBe(true);
	});
});
describe('loadApplication', () => {
	const dummySearchData: ApplicationPath[] = [
		{
			path: [
				{
					id: 1,
					key: 'dc91a61c-5ab0-e711-8b81-005056b80f19',
					name: 'E2E Group',
					value: 'wqq',
					_links: null,
				},
			],
			_links: null,
		},
	];
	beforeEach(() => {
		useSearchStore.setState({
			...useSearchStore.getState(),
			searchData: dummySearchData,
		});
	});

	it('loads an search application by its Key from API', async () => {
		jest
			.spyOn(axios, 'get')
			.mockResolvedValueOnce({
				data: { data: dummySearchData[0], success: true },
			})
			.mockResolvedValueOnce({
				data: {
					data: {
						items: dummySearchData,
						limit: 10,
						offset: 5,
						totalCount: 25,
						links: dummySearchData[0]._links,
					},
				},
			});

		await useSearchStore.getState().searchApplication('Test');
		expect(axios.get).toHaveBeenCalled();
		expect(axios.get).toHaveBeenCalledWith(
			'applications/0/paths/?keyword=Test',
		);
		expect(useSearchStore.getState().searchLoading).toBe(false);
	});
});
