import React, { useState } from 'react';
import './App.css';

interface ItreeData {
	name: string,
	key: number,
	children: ItreeData[],
}


function App() {
	// const {
	// 	activeNodeId,
	// 	loading,
	// 	initializeHierarchyState,
	// 	hierarchyData,
	// 	loadApplication,
	// 	setLoading,
	// } = useHierarchyStore();
const [data] = useState<ItreeData[]>([
	{
		name: 'a',
		key: -1,
		children: [
			{ name: 'a.a.1', key: 1, children: [] },
			{ name: 'a.a.2', key: 2, children: [] },
		],
	},
	{
		name: 'b',
		key: -2,
		children: [
			{ name: 'b.b.1', key: 3, children: [] },
			{ name: 'b.b.2', key: 4, children: [] },
		],
	},
	{
		name: 'c',
		key: -3,
		children: [
			{ name: 'b.b.1', key: 5, children: [] },
			{ name: 'b.b.2', key: 6, children: [] },
		],
	},
	{
		name: 'd',
		key: -4,
		children: [
			{ name: 'b.b.1', key: 7, children: [] },
			{ name: 'b.b.2', key: 8, children: [] },
		],
	},
]);



	// useEffect(() => {
	// 	initializeHierarchyState();
	// 	setLoading(true);
	// 	loadApplication();
	// }, []);

	return (
		<div className="App">
			{/* <header className="App-header">
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
					<span className="text-5xl text-black">loading....</span>
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
			</header> */}

			<div className="absolute w-full h-full text-white bg-blue-700">
				<ul className="top-0 left-0 right-0 z-10 w-1/4 h-full pl-5 ml-3 overflow-hidden">
					{data.map(item => (
						<li
							key={item.key}
							className="relative flex flex-col list-none m-t-3 m-b-3 tree">
							<div className="flex flex-row items-center justify-start space-x-2">
								<div className="w-4 h-4 text-gray-400 bg-gray-100 rounded-sm">
									<span>-</span>
								</div>
								<div className="w-16 h-8 border-indigo-200">
									<div>{item.name}</div>
								</div>
							</div>
							<ul className="pl-5 ml-2">
								{item.children.map(c => (
									<li
										key={item.key}
										className="relative flex flex-col pl-5 mt-3 mb-3 list-none tree">
										<div>{c.name}</div>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default App;
