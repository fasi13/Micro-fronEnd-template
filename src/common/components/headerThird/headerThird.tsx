import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React from 'react';
import { useDetachStore } from '../../../state';

export const HeaderThird: React.FunctionComponent = () => {
	const dSOpen = useDetachStore(state => state.setOpen);
	const open = useDetachStore(state => state.open);
	const detachSidebar = useDetachStore(state => state.detachSidebar);

	const handleDrawerOpen = () => {
		dSOpen(!open);
	};
	const ArrowToggle = () =>
		open ? (
			<div data-testid="arrow-back">
				<ArrowBackIosIcon />
			</div>
		) : (
			<div data-testid="arrow-forward">
				<ArrowForwardIosIcon />
			</div>
		);

	return (
		<div
			className="fixed w-full py-6"
			style={{ background: '#8999A6', height: '80px' }}>
			{!detachSidebar ? (
				<div
					data-testid="drawer-open"
					onKeyDown={undefined}
					role="button"
					tabIndex={0}
					color="inherit"
					aria-label="open drawer"
					onClick={handleDrawerOpen}
					className="sidebar-arrows">
					{ArrowToggle()}
				</div>
			) : null}
		</div>
	);
};
