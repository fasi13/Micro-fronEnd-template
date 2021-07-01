import React, { useEffect } from 'react';
import { useHierarchyStore } from '../../state';
import './App.css';
import Home from './Home/Home';

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
			{loading ? (
				<header>
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

					<span className="text-black text-5xl">loading....</span>
				</header>
			) : (
				<Home />
			)}
		</div>
	);
}

export default App;
