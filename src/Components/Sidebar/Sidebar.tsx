import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Search } from '@material-ui/icons';
import React from 'react';
import { Rnd } from 'react-rnd';
import detachStore from '../../state/detachSidebar.store';

const SidebarContent = () => (
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

export default function Sidebar() {
	const style = {
		display: 'flex',
		alignItems: 'start',
		justifyContent: 'center',
		background: '#31506A',
		zIndex: 99999,
		top: '35px !important',
		left: '35px !important',
		boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
	};
	const dSOpen = detachStore(state => state.setOpen);
	const dSSetDetachSidebar = detachStore(state => state.setDetachSidebar);
	const dSSidebarState = detachStore(state => state.detachSidebar);

	const setOpen = (opn: boolean) => {
		dSOpen(opn);
	};

	const setTearSidebar = (detach: boolean) => {
		setOpen(false);
		dSSetDetachSidebar(detach);
	};
	const handleAttach = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			setTearSidebar(false);
	};

	return dSSidebarState ? (
		<Rnd
			style={style}
			default={{
				x: 500,
				y: 0,
				width: 320,
				height: 600,
			}}>
			<SidebarContent />
			<div
				onKeyDown={() => handleAttach}
				role="button"
				tabIndex={0}
				aria-label="close-tear"
				style={{
					fontSize: 20,
					background: '#31506A',
					borderRadius: '0px 8px 8px 0px',
					color: 'white',
					boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
				}}
				id="icon"
				onClick={handleAttach}>
				x
			</div>
		</Rnd>
	) : (
		<SidebarContent />
	);
}
