import {
	CircularProgress,
	createStyles,
	List,
	makeStyles,
	TextField
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-hooks';
import { useSearchStore } from '../../../state';
import { ApplicationPath } from '../../../types';
import { SearchApplication } from './search-application';

const useStyles = makeStyles(() =>
	createStyles({
		rootList: {
			margin: -16,
			background: 'white',
			width: 445,
			'& :hover': {
				background: '#d3d3d3',
			},
		},
		searchInput: {
			'& .MuiSvgIcon-root': {
				fontSize: '2rem',
				color: 'grey',
			},
			'& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input':
				{
					fontSize: '1.2rem',
				},
			'& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
				borderRadius: '0',
			},
		},
	}),
);

function SearchBar() {
	const classes = useStyles();

	const [inputValue, setInputValue] = useState<string>('');
	const [inputKeyword, setInputKeyword] = useState<string>('');
	const debounceSearchTerm = useDebounce(inputValue, 500);

	const [open, setOpen] = React.useState(false);
	const { searchData, searchLoading, searchApplication } = useSearchStore();

	let searchSet = new Set<ApplicationPath>(searchData.map(d => d));

  const searchElement = (keyword: string) => {
		setInputKeyword(keyword);

		return keyword.length < 3 ? null : setInputValue(keyword);
	};

  const updateAutocompletePopper = () => {
		setOpen(!open);
	};

	useEffect(() => {
		searchApplication(inputValue);
	}, [debounceSearchTerm]);

	useEffect(() => {
		searchSet = new Set<ApplicationPath>(searchData.map(d => d));
	}, [searchData]);

	useEffect(() => {
		if (!open) {
			useSearchStore.setState({ searchData: [] });
      searchSet.clear();
		}
	}, [open]);

	useEffect(() => {
		if (inputKeyword.length < 3) {
			useSearchStore.setState({ searchData: [] });
      searchSet.clear();
		}
	}, [inputKeyword]);

	const getApplicationName = ({ path }: ApplicationPath): string =>
		path[path.length - 1].name;

	const getApplicationId = ({ path }: ApplicationPath): string =>
		path[path.length - 1].id.toString();


	return (
		<Autocomplete
			data-testid="searchautocomplete"
			open={open}
			onOpen={updateAutocompletePopper}
			onClose={updateAutocompletePopper}
			id="combo-box-demo"
			style={{ width: 445, backgroundColor: '#d1d5db', zIndex: 999999 }}
			className={classes.searchInput}
			options={Array.from(searchSet)}
			getOptionLabel={x => getApplicationName(x)}
			autoComplete
			fullWidth
			includeInputInList
			filterSelectedOptions
			loading={searchLoading}
			noOptionsText={
				inputKeyword.length < 3
					? 'Requires at least 3 characters'
					: 'No results found!'
			}
			renderInput={params => (
				<TextField
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...params}
					onChange={e => searchElement(e.target.value.toString())}
					data-testid="searchfield"
					placeholder="Search"
					variant="outlined"
					fullWidth
					InputProps={{
						...params.InputProps,
						startAdornment: (
							<>
								<SearchIcon />
							</>
						),
						endAdornment: (
							<>
								{searchLoading ? (
									<CircularProgress
										color="inherit"
										size={20}
										data-testid="searchfield-progress"
									/>
								) : null}
							</>
						),
					}}
				/>
			)}
			renderOption={item => (
				<List className={classes.rootList} data-testid="searchresult-list">
					<SearchApplication item={item} key={getApplicationId(item)} />
				</List>
			)}
		/>
	);
}

export default SearchBar;
