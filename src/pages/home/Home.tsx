import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { Rnd } from 'react-rnd';
import { Header, HeaderThird, Sidebar } from '../../common/components';
import { detachStore } from '../../state';
import './home.scss';

const drawerWidth = 500;

const useStyles = makeStyles(theme => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		background: '#31506A',
		border: 'none',
		width: drawerWidth,
		paddingTop: 145,
		overflow: 'hidden',
		paddingRight: '8px',
		paddingBottom: '8px',
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
}));

// let centerX;
// let centerY;

// if (document.documentElement && document.documentElement.clientHeight) {
const centerX = document.documentElement.clientWidth;
const centerY = document.documentElement.clientHeight;
// } else if (window.innerHeight) {
// 	centerX = window.innerWidth;
// 	centerY = window.innerHeight;
// } else {
// 	centerX = document.body.clientWidth;
// 	centerY = document.body.clientHeight;
// }
const detachedSidebarWidth = 500;
const detachedSidebarHeight = 700;
const offsetLeft = (centerX - detachedSidebarWidth) / 2;
const offsetTop = (centerY - detachedSidebarHeight) / 2;

export const Home = () => {
	const dSOpen = detachStore(state => state.setOpen);

	const classes = useStyles();

	const open = detachStore(state => state.open);

	const dSSetDetachSidebar = detachStore(state => state.setDetachSidebar);
	const dSSidebarState = detachStore(state => state.detachSidebar);

	const setOpen = (opn: boolean) => {
		dSOpen(opn);
	};
	const setDetachSidebar = (detach: boolean) => {
		setOpen(false);
		dSSetDetachSidebar(detach);
	};

	const handleAttach = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			setDetachSidebar(false);
	};

	return (
		<div className="flex min-h-screen root">
			{/* <CssBaseline /> */}
			<Header />
			<Drawer
				data-testid="drawer"
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}>
				<Sidebar />
			</Drawer>
			{dSSidebarState ? (
				<Rnd
					data-testid="rnd"
					className="rndcustomize relative"
					bounds=".root"
					default={{
						x: offsetLeft,
						y: offsetTop,
						width: detachedSidebarWidth,
						height: detachedSidebarHeight,
					}}>
					<div
						className="w-full h-full m-4 mr-1 overflow-hidden journal-scroll pr-2 cursor-auto"
						style={{ width: 'inherit', height: '98%' }}>
						<Sidebar />
					</div>
					<div
						data-testid="close-detached-sidebar"
						className="closeDetachedSidebar"
						onKeyDown={() => handleAttach}
						role="button"
						tabIndex={0}
						aria-label="close-detach"
						onClick={handleAttach}>
						x
					</div>
				</Rnd>
			) : null}
			<div
				className={clsx(classes.content, {
					[classes.contentShift]: open,
				})}>
				<div className="header3 h-5">
					<HeaderThird />
				</div>
				<div className={classes.drawerHeader} />
				Body Content here
			</div>
		</div>
	);
};
