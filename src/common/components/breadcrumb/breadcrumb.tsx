/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { Route } from 'react-router';
import { detachStore } from '../../../state';
import Breadcrumbui from './breadcrumb-ui';
import './breadcrumb.scss';

export const OrbitSVG = (props: any) => (
	<svg
		data-testid="detach-icon"
		className={`${props.detachSidebar ? 'sidebarDetached' : ''}`}
		xmlns="http://www.w3.org/2000/svg"
		focusable="false"
		width="1.4em"
		height="1.4em"
		preserveAspectRatio="xMidYMid meet"
		fill="white"
		viewBox="0 0 24 24">
		<path
			d="M8.11 1.75C9.3 1.25 10.62 1 12 1c6.08 0 11 4.92 11 11s-4.92 11-11 11S1 18.08 1 12c0-1.38.25-2.7.72-3.92a4.5 4.5 0 0 0 1.73 1.1C3.16 10.07 3 11 3 12a9 9 0 0 0 9 9a9 9 0 0 0 9-9a9 9 0 0 0-9-9c-1 0-1.93.16-2.82.45c-.22-.62-.57-1.21-1.07-1.7M4.93 2.93a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5z"
			fill="white"
		/>
	</svg>
);

export const Breadcrumb = () => {
	const dSOpen = detachStore(state => state.setOpen);
	const dSSetDetach = detachStore(state => state.setDetachSidebar);
	const dSSetLastSideBarState = detachStore(state => state.setLastSidebarOpen);

	const open = detachStore(state => state.open);
	const detachSidebar = detachStore(state => state.detachSidebar);
	const lastSidebarOpen = open;

	const setOpen = (opn: boolean) => {
		dSOpen(opn);
	};

	const setDetachSidebar = (t: boolean) => {
		dSSetDetach(t);
	};
	const setLastSidebarOpen = (last: boolean) => {
		dSSetLastSideBarState(last);
	};
	const handleDetach = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			if (!detachSidebar) {
				setLastSidebarOpen(open);
				setDetachSidebar(true);
				setOpen(false);
			} else {
				setOpen(lastSidebarOpen);
				setDetachSidebar(false);
				setOpen(true);
			}
	};

	return (
		<div className="py-4 text-xl pl-14" style={{ background: '#31506A' }}>
			<div className="flex flex-wrap">
				<div
					onKeyDown={handleDetach}
					role="button"
					tabIndex={0}
					aria-controls="customized-menu"
					aria-haspopup="true"
					color="primary"
					onClick={handleDetach}>
					<OrbitSVG detachSidebar={detachSidebar} />
				</div>
				<span className="pl-2">
          {/* E2e Group */}
          <Route>
            {({ location }) => {
              const pathnames = location.pathname.split('/').filter((x) => x);
              console.log(pathnames)
              return (
                <Breadcrumbui pathnames={pathnames} />
              );
            }}
          </Route>
        </span>
			</div>
		</div>
	);
};
