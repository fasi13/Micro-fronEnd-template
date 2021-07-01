import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Search } from '@material-ui/icons';
import React from 'react';

export default function Sidebar() {
	return (
		<div className="px-8 py-2">
			<FormControl>
				<Input
					id="input-with-icon-adornment"
					startAdornment={
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					}
				/>
			</FormControl>
			Sidebar content here Sidebar content here Sidebar content here2
		</div>
	);
}
