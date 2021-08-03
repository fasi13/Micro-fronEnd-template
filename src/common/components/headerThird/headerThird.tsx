import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React from 'react';
import { detachStore } from '../../../state';

export const HeaderThird: React.FunctionComponent = () => {
	const dSOpen = detachStore(state => state.setOpen);
	const open = detachStore(state => state.open);
	const detachSidebar = detachStore(state => state.detachSidebar);

	const handleDrawerOpen = (event: any) => {
		if (event.key === 'Enter' || event.type === 'click') dSOpen(!open);
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
					onKeyDown={handleDrawerOpen}
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
