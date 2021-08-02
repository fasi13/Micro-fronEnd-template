import { ApiResponse, ApplicationPath, DataPaginated } from '../types';
import { HierarchyClient as axios } from '../util/axios';
import createStore from '../util/immer';

interface SearchState {
	searchData: ApplicationPath[];
	searchedKeyWord: string;
	searchLoading: boolean;
	activeNodeId: number;
	setSearchLoading: (val: boolean) => void;
	searchApplication: (keyword: string) => void;
}

const SearchStore = (set: any, get: any): SearchState => ({
	searchData: [],
	searchedKeyWord: '',
	searchLoading: false,
	activeNodeId: 0,
	setSearchLoading: (val: boolean) =>
		set((state: SearchState) => {
			state.searchLoading = val;
		}),
	searchApplication: async (keyword: string) => {
		if (keyword !== '') {
			set((state: SearchState) => {
				state.searchLoading = true;
			});
			await axios
				.get<ApiResponse<DataPaginated<ApplicationPath>>>(
					`applications/${get().activeNodeId}/paths/?keyword=${keyword}`,
				)
				.then(resp => {
					set((state: SearchState) => {
						state.searchData = resp.data?.data?.items;
						state.searchLoading = false;
					});
				});
		}
	},
});

export const useSearchStore = createStore<SearchState>(SearchStore);
