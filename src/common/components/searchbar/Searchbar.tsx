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
	const debounceSearchTerm = useDebounce(inputValue, 500);

	const [open, setOpen] = React.useState(false);
	// searchLoading,
	const { searchData, searchLoading, setSearchLoading, searchApplication } =
		useSearchStore();

	useEffect(() => {
		if (debounceSearchTerm) {
			setSearchLoading(true);
			searchApplication(inputValue);
		} else {
			setSearchLoading(false);
		}
	}, [debounceSearchTerm]);

	const updateAutocompletePopper = () => {
		setOpen(!open);
	};

	let searchSet = new Set<ApplicationPath>(searchData.map(d => d));

	useEffect(() => {
		searchSet = new Set<ApplicationPath>(searchData.map(d => d));
	}, [searchData]);

	const getApplicationName = ({ path }: ApplicationPath): string =>
		path[path.length - 1].name;

	const getApplicationId = ({ path }: ApplicationPath): string =>
		path[path.length - 1].id.toString();

	const searchElement = (keyword: string) =>
		keyword.length < 3 ? null : setInputValue(keyword);

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
			loading={searchLoading}
			noOptionsText="No results found!"
			renderInput={params => (
				<TextField
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...params}
					data-testid="searchfield"
					onChange={e => searchElement(e.target.value.toString())}
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
			renderOption={item =>
				Array.from(searchSet).length !== 0 ? (
					<List className={classes.rootList}>
						<SearchApplication item={item} key={getApplicationId(item)} />
					</List>
				) : (
					<p>No results found! </p>
				)
			}
		/>
	);
}

export default SearchBar;
