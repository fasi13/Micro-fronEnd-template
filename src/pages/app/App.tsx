import React, { useEffect } from 'react';
import { useHierarchyStore } from '../../state';
import './App.css';

function App() {
	const {
		activeNodeId,
		loading,
		initializeHierarchyState,
		hierarchyData,
		loadApplication,
		setLoading,
	} = useHierarchyStore();

	useEffect(() => {
		initializeHierarchyState();
		setLoading(true);
		loadApplication();
	}, []);

	return (
		<div className="App">
			<header className="App-header">
				<p data-testid="message">get started</p>
				<a
					data-testid="learn-link"
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer">
					Learn React
				</a>
				<p className="text-3xl text-white">{activeNodeId}</p>
				<div>{JSON.stringify(hierarchyData)}</div>
				{loading ? (
					<span>loading....</span>
				) : (
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
				)}
			</header>
		</div>
	);
}

export default App;
