import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React from 'react';
import { detachStore } from '../../../state';

export const HeaderThird = () => {
	const dSOpen = detachStore(state => state.setOpen);
	const open = detachStore(state => state.open);
	const detachSidebar = detachStore(state => state.detachSidebar);

	const handleDrawerOpen = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			dSOpen(!open);
	};

	return (
		<div
			className="fixed w-full py-3 "
			style={{ background: '#8999A6', height: '65px' }}>
			{!detachSidebar ? (
				<div
					data-testid="drawer-open"
					onKeyDown={() => handleDrawerOpen}
					role="button"
					tabIndex={0}
					color="inherit"
					aria-label="open drawer"
					onClick={handleDrawerOpen}
					className="sidebar-arrows">
					{open ? (
						<div data-testid="arrow-back">
							<ArrowBackIosIcon />
						</div>
					) : (
						<div data-testid="arrow-forward">
							<ArrowForwardIosIcon />
						</div>
					)}
				</div>
			) : null}
		</div>
	);
};
