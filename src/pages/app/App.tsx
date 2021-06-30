import React, { useEffect, useState } from 'react';
import { useHierarchyStore } from '../../state';
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
		searchApplication,
	} = useHierarchyStore();

	useEffect(() => {
		initializeHierarchyState();
		setLoading(true);
		loadApplication();
		getApplicationGroups();
	}, []);
	useEffect(() => {
		const handler = setTimeout(() => {
			if (inputValue) {
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

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<div className="App">
				<header className="App-header">
					<p data-testid="message">get started</p>
					<div>
						<input
							placeholder="Search application..."
							type="text"
							onChange={e => searchElement(e.target.value)}
						/>
						<br />
						<br />
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

					<button
						type="button"
						aria-controls="alt"
						tabIndex={0}
						onKeyDown={e => {
							e.stopPropagation();
						}}
						onClick={() => loadApplication()}>
						Inc
					</button>
					<div>
						{hierarchyData.map(item => (
							<div style={{ flex: 'row' }}>
								{' '}
								<div>
									{' '}
									<p>{item.name}</p>
								</div>
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
									<button
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
									</button>
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
