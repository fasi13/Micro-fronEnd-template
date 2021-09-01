import React from 'react';
import { useDetachStore } from '../../../state';
import Breadcrumbview from './breadcrumb';
import './headerSecond.scss';

export const OrbitSVG = (props: any) => {
	const detachProps = props;
	return (
		<div
			data-testid="detach-icon"
			className={`${detachProps.detachSidebar ? 'sidebarDetached' : ''}`}>
			<svg
				style={{ width: '50px', height: '100%' }}
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
		</div>
	);
};

export const HeaderSecond: React.FunctionComponent = () => {
	const dSOpen = useDetachStore(state => state.setOpen);
	const dSSetDetach = useDetachStore(state => state.setDetachSidebar);
	const dSSetLastSideBarState = useDetachStore(
		state => state.setLastSidebarOpen,
	);

	const open = useDetachStore(state => state.open);
	const detachSidebar = useDetachStore(state => state.detachSidebar);
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
		if (event.key === 'Enter' || event.type === 'click')
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
		<div className="px-6 py-2 text-xl bg-sanjuan">
			<div className="inline-flex   p-px">
				<div
					data-testid="detach-handler"
					onKeyDown={handleDetach}
					role="button"
					tabIndex={0}
					aria-controls="customized-menu"
					aria-haspopup="true"
					color="primary"
					onClick={handleDetach}>
					<OrbitSVG detachSidebar={detachSidebar} />
				</div>
				<span className="self-center pl-2 tooltip">
					<Breadcrumbview />
				</span>
			</div>
		</div>
	);
};
