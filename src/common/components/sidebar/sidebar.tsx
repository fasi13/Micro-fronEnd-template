/* eslint-disable react/jsx-props-no-spreading */
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
import { HierarchyTree, SearchApplication } from '..';
import { detachStore, useHierarchyStore, useSearchStore } from '../../../state';
import { ApplicationPath, NodePath, TreeView } from '../../../types';
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

	useEffect(() => {
		const handler = setTimeout(() => {
			if (inputValue) {
				setSearchLoading(true);
				searchApplication(inputValue);
			}
		}, 1000);
		return () => {
			clearTimeout(handler);
		};
	}, [inputValue]);

	const getApplicationName = ({ path }: ApplicationPath): string =>
		path[path.length - 1].name;

	const getApplicationId = ({ path }: ApplicationPath): string =>
		path[path.length - 1].id.toString();

	const searchElement = (keyword: string) =>
		keyword.length < 3 ? null : setInputValue(keyword);
	const dSSidebarState = detachStore(state => state.detachSidebar);
	return (
		<>
			<div className="flex justify-center rnd-move">
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
					options={searchData}
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
					renderOption={() =>
						searchData.length !== 0 ? (
							<List className={classes.rootList}>
								{searchData.map((item: ApplicationPath) => (
									<SearchApplication item={item} key={getApplicationId(item)} />
								))}
							</List>
						) : (
							<p>No results found! </p>
						)
					}
				/>
			</div>
			<br />
			<div
				className="overflow-y-auto bg-grayblue journal-scroll"
				style={dSSidebarState ? { height: '83%' } : { height: 'inherit' }}>
				<div className="bg-grayblue" style={widthStyle}>
					<HierarchyTree
						onSelect={() => {
							console.log('hi');
						}}
						onToggle={async (
							item: TreeView,
							nodeId: number,
							nodePath: NodePath[],
							cb: () => void,
						) => {
							await getHierarchyChildData(item, nodeId, nodePath);
							cb();
						}}
						onAddGroup={async (
							item: TreeView,
							nodeId: number,
							nodePath: NodePath[],
							name: string,
							cb: (err: any) => void,
						) => {
							await createApplicationGroup(item, nodeId, nodePath, name);
							cb(null);
						}}
						onAddApplication={async (
							item: TreeView,
							nodeId: number,
							nodePath: NodePath[],
							name: string,
							value: string,
							cb: (err: any) => void,
						) => {
							await createApplication(item, nodeId, nodePath, name, value);
							cb(null);
						}}
						onEditApplication={async (
							item: TreeView,
							nodeId: number,
							nodePath: NodePath[],
							name: string,
							value: string,
							cb: (err: any) => void,
						) => {
							await editApplication(item, nodeId, nodePath, name, value);
							cb(null);
						}}
						onEditGroup={async (
							item: TreeView,
							nodeId: number,
							nodePath: NodePath[],
							name: string,
							cb: (err: any) => void,
						) => {
							await editApplicationGroup(item, nodeId, nodePath, name);
							cb(null);
						}}
						data={hierarchyData}
						expandNodesAtLevel={0}
					/>
				</div>
			</div>
		</>
	);
};

export const Sidebar = () => <SidebarContent />;
