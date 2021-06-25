import React from 'react';
import './App.css';

function App() {
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
			</header>
		</div>
	);
}

export default App;
