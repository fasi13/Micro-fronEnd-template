import {
	CircularProgress,
	createStyles,
	List,
	makeStyles,
	TextField,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-hooks';
import { useSearchStore } from '../../../state';
import { ApplicationPath } from '../../../types';
import { SearchApplication } from './search-application';
import { getApplicationId, getApplicationName } from './utils';

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
				color: '#819AAE',
			},
			'& .MuiOutlinedInput-notchedOutline': {
				borderColor: '#C2CBD3',
			},
			'&:hover .MuiOutlinedInput-notchedOutline': {
				borderColor: '#C2CBD3',
			},
			'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
				borderColor: '#C2CBD3',
			},
			'& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input':
				{
					fontSize: '1.2rem',
					padding: '0 4px',
				},
			'& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
				borderRadius: '5px',
				background: '#C2CBD3',
				height: '50px',
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
	const emptySearchData: ApplicationPath[] = [];

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
		if (searchData.length === 0) {
			setInputValue('');
		}
	}, [searchData]);

	useEffect(() => {
		if (!open || inputKeyword.length < 3) {
			useSearchStore.setState({ searchData: emptySearchData });
		}
	}, [open, inputKeyword]);

	return (
		<Autocomplete
			data-testid="searchautocomplete"
			open={open}
			onOpen={updateAutocompletePopper}
			onClose={updateAutocompletePopper}
			id="combo-box-demo"
			style={{ width: 445, zIndex: 999999 }}
			className={classes.searchInput}
			options={searchData}
			getOptionLabel={getApplicationName}
			autoComplete
			fullWidth
			includeInputInList
			filterSelectedOptions
			loading={searchLoading}
			filterOptions={y => y}
			noOptionsText={
				inputKeyword.length < 3
					? 'Requires at least 3 characters'
					: 'No results found!'
			}
			renderInput={params => (
				<TextField
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...params}
					onChange={e => searchElement(e.target.value.trim().toString())}
					data-testid="searchfield"
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
