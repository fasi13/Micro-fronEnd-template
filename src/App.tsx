import React from 'react';
import './App.css';
import logo from './logo.svg';

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img data-testid="logo" src={logo} className="App-logo" alt="logo" />
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
