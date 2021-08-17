import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { Rnd } from 'react-rnd';
import { Header, HeaderThird, Sidebar } from '../../common/components';
import { useDetachStore } from '../../state';
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
		paddingTop: 165,
		overflow: 'hidden',
		paddingRight: '8px',
		paddingBottom: '8px',
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(5, 5),
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

const centerX = document.documentElement.clientWidth;
const centerY = document.documentElement.clientHeight;

const detachedSidebarWidth = 500;
const detachedSidebarHeight = 700;
const offsetLeft = (centerX - detachedSidebarWidth) / 2;
const offsetTop = (centerY - detachedSidebarHeight) / 2;

export const Home: React.FunctionComponent = () => {
	const dSOpen = useDetachStore(state => state.setOpen);

	const classes = useStyles();

	const open = useDetachStore(state => state.open);

	const dSSetDetachSidebar = useDetachStore(state => state.setDetachSidebar);
	const dSSidebarState = useDetachStore(state => state.detachSidebar);

	const setOpen = (opn: boolean) => {
		dSOpen(opn);
	};
	const setDetachSidebar = (detach: boolean) => {
		setOpen(false);
		dSSetDetachSidebar(detach);
	};

	const handleAttach = () => {
		setDetachSidebar(false);
	};

	return (
		<div className="flex min-h-screen root">
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
					className="relative rndcustomize"
					bounds=".root"
					default={{
						x: offsetLeft,
						y: offsetTop,
						width: detachedSidebarWidth,
						height: detachedSidebarHeight,
					}}>
					<div className="w-full h-full pr-2 m-4 mr-1 overflow-hidden cursor-auto journal-scroll">
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
				<div className="h-6 header3">
					<HeaderThird />
				</div>
				<div className={classes.drawerHeader} />
				Body Content here
			</div>
		</div>
	);
};
