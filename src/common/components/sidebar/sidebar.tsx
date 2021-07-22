/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  createStyles, List, makeStyles,
  TextField
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-hooks';
import { HierarchyTree, SearchApplication } from '..';
import { detachStore, useHierarchyStore, useSearchStore } from '../../../state';
import { ApplicationPath, ErrorResponse, NodePath, TreeView } from '../../../types';
import './sidebar.scss';

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

const SidebarContent = () => {
	const classes = useStyles();
	// searchLoading,
	const { setSearchLoading, searchApplication, searchData, searchLoading } =
		useSearchStore();

	const [inputValue, setInputValue] = useState<string>('');
	const debounceSearchTerm = useDebounce(inputValue,500);

	const [open, setOpen] = React.useState(false);
	// const searchLoading = open && searchData.length === 0;

	const widthStyle = { width: '96%', height: 'inherit' };
	const {
		initializeHierarchyState,
		hierarchyData,
		setLoading,
		getHierarchyChildData,
		getUserApplication,
		createApplicationGroup,
		createApplication,
		editApplication,
		editApplicationGroup,
	} = useHierarchyStore();

	useEffect(() => {
		initializeHierarchyState();
		setLoading(true);
		getUserApplication();
	}, []);

	// CodeReview: bad implementation. please clean your useEffect and if possible use a Hook to create debounce.
	// useEffect(() => {
	// 	const handler = setTimeout(() => {
	// 		if (inputValue) {
	// 			setSearchLoading(true);
	// 			searchApplication(inputValue);
	// 		}
	// 	}, 1000);
	// 	return () => {
	// 		clearTimeout(handler);
	// 	};
	// }, [inputValue]);

	let searchSet = new Set<ApplicationPath>(searchData.map((d) => d));


	useEffect(() => {
		 searchSet = new Set<ApplicationPath>(searchData.map(d => d));
	} ,[searchData])


	useEffect(() => {
		if(debounceSearchTerm) {
					setSearchLoading(true);
					searchApplication(inputValue);
		}
		else
		{
				setSearchLoading(false);
		}
	},[debounceSearchTerm])

	const getApplicationName = ({ path }: ApplicationPath): string =>
		path[path.length - 1].name;

	const getApplicationId = ({ path }: ApplicationPath): string =>
		path[path.length - 1].id.toString();

	const searchElement = (keyword: string) =>
		keyword.length < 3 ? null : setInputValue(keyword);
	const dSSidebarState = detachStore(state => state.detachSidebar);

	const onToggleFn = useCallback(
		async (
			item: TreeView,
			nodeId: number,
			nodePath: NodePath[],
			cb: (err: ErrorResponse | null) => void,
		) => {
			getHierarchyChildData(item, nodeId, nodePath, cb);
		},
		[],
	);

	const onAddGroupFn = useCallback(
		async (
			item: TreeView,
			nodeId: number,
			nodePath: NodePath[],
			name: string,
			cb: (err: ErrorResponse | null) => void,
		) => {
			createApplicationGroup(item, nodeId, nodePath, name, cb);
		},
		[],
	);

	const onAddApplicationFn = useCallback(
		async (
			item: TreeView,
			nodeId: number,
			nodePath: NodePath[],
			name: string,
			value: string,
			cb: (err: ErrorResponse | null) => void,
		) => {
			createApplication(item, nodeId, nodePath, name, value, cb);
		},
		[],
	);

	const onEditApplicationFn = useCallback(
		async (
			item: TreeView,
			nodeId: number,
			nodePath: NodePath[],
			name: string,
			value: string,
			cb: (err: ErrorResponse | null) => void,
		) => {
			editApplication(item, nodeId, nodePath, name, value, cb);
		},
		[],
	);

	const onEditGroupFn = useCallback(
		async (
			item: TreeView,
			nodeId: number,
			nodePath: NodePath[],
			name: string,
			cb: (err: ErrorResponse | null) => void,
		) => {
			editApplicationGroup(item, nodeId, nodePath, name, cb);
		},
		[],
	);

	const onSelectFn = useCallback(() => {
		console.log('on select');
	}, []);

	return (
		<>
			<div className="flex justify-center rnd-move">
				{/* CodeReview: Please Refactor Autocomplete to another component */}
				{/* <div className="text-white">{JSON.stringify(searchData.length)}</div> */}

				<Autocomplete
					data-testid="searchautocomplete"
					open={open}
					onOpen={() => {
						setOpen(true);
					}}
					onClose={() => {
						setOpen(false);
					}}
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
							{...params}
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
											<CircularProgress color="inherit" size={20} />
										) : null}
									</>
								),
							}}
						/>
					)}
					renderOption={(item) =>
						Array.from(searchSet).length !== 0 ? (
							<List className={classes.rootList}>
								<SearchApplication item={item} key={getApplicationId(item)} />
							</List>
						) : (
							<p>No results found! </p>
						)
					}
				/>
			</div>
			<br />
			{/* CodeReview:  Providing style like that will make it re render on every change please look into useMemo or useCallback */}
			<div
				className="overflow-y-auto bg-grayblue journal-scroll"
				style={dSSidebarState ? { height: '83%' } : { height: 'inherit' }}>
				<div className="" style={widthStyle}>
					<HierarchyTree
						onSelect={onSelectFn}
						onToggle={onToggleFn}
						onAddGroup={onAddGroupFn}
						onAddApplication={onAddApplicationFn}
						onEditApplication={onEditApplicationFn}
						onEditGroup={onEditGroupFn}
						data={hierarchyData}
						expandNodesAtLevel={0}
					/>
				</div>
			</div>
		</>
	);
};

export const Sidebar = () => <SidebarContent />;
