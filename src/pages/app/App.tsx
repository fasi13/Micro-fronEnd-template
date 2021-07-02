import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { SearchApplication } from '../../common/components';
import { useHierarchyStore, useSearchStore } from '../../state';
import { TreeView } from '../../types';
import './App.css';

const App = () => {
	const [inputValue, setInputValue] = useState<string>('');
	const {
		activeNodeId,
		loading,
		newChange,
		initializeHierarchyState,
		hierarchyData,
		loadApplication,
		setLoading,
		getApplicationGroups,
		setNewChange,
		createApplicationGroup,
		getHierarchyChildeData,
		childrenData,
	} = useHierarchyStore();

	const { setSearchLoading, searchApplication, searchData } = useSearchStore();

	useEffect(() => {
		initializeHierarchyState();
		setLoading(true);
		loadApplication();
		getApplicationGroups();
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

	const setNewGroup = (value: string) => {
		setNewChange(value);
	};
	const addApplicationGroup = (item: TreeView, action: string) => {
		createApplicationGroup(item, action, { name: newChange });
	};

	const searchElement = (keyword: string) =>
		keyword.length < 3 ? null : setInputValue(keyword);

	const toggleCollapse = (item: TreeView) => {
		setLoading(true);
		getHierarchyChildeData(item);
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<div className="App">
				<header className="App-header">
					<p data-testid="message">get started</p>
					<div>
						<TextField
							id="standard-search"
							label="Search application..."
							type="search"
							onChange={e => searchElement(e.target.value)}
						/>
						{searchData.length ? (
							<SearchApplication />
						) : (
							<p>No results found! </p>
						)}
						<br />
					</div>

					<a
						data-testid="learn-link"
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer">
						Learn React
					</a>
					<p className="text-3xl text-white">{activeNodeId}</p>
					<div>
						{hierarchyData.map(item => (
							<div style={{ flex: 'row' }}>
								{' '}
								<div
									onKeyDown={e => {
										e.stopPropagation();
									}}
									onClick={() => toggleCollapse(item)}
									role="link"
									tabIndex={0}>
									{' '}
									<p>{item.name}</p>
								</div>
								{childrenData
									? childrenData.map(i => (
											<div
												onKeyDown={e => {
													e.stopPropagation();
												}}
												onClick={() => toggleCollapse(i)}
												role="link"
												tabIndex={0}>
												<p>{i.name}</p>
											</div>
									  ))
									: null}
								<div>
									<input
										type="text"
										id="fname"
										name="fname"
										onChange={e => setNewGroup(e.target.value)}
									/>
									<br />
									<br />
									<br />
								</div>
								<div>
									<Button
										variant="contained"
										color="primary"
										type="button"
										aria-controls="alt"
										tabIndex={0}
										onKeyDown={e => {
											e.stopPropagation();
										}}
										onClick={() =>
											addApplicationGroup(item, 'createApplicationGroup')
										}>
										create Group
									</Button>
									<Button
										variant="contained"
										color="primary"
										type="button"
										aria-controls="alt"
										tabIndex={0}
										onKeyDown={e => {
											e.stopPropagation();
										}}
										onClick={() =>
											addApplicationGroup(item, 'createApplication')
										}>
										create application
									</Button>
									<Button
										variant="contained"
										color="primary"
										type="button"
										aria-controls="alt"
										tabIndex={0}
										onKeyDown={e => {
											e.stopPropagation();
										}}
										onClick={() =>
											addApplicationGroup(item, 'updateApplication')
										}>
										Edit application
									</Button>
									<Button
										variant="contained"
										color="primary"
										type="button"
										aria-controls="alt"
										tabIndex={0}
										onKeyDown={e => {
											e.stopPropagation();
										}}
										onClick={() =>
											addApplicationGroup(item, 'updateApplicationGroup')
										}>
										update application Group
									</Button>
								</div>
							</div>
						))}
					</div>
				</header>
			</div>
		</>
	);
};

export default App;
