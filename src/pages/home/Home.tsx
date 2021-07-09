import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import clsx from 'clsx';
import React from 'react';
import { Header, Sidebar } from '../../common/components';
import { detachStore } from '../../state';
import './home.scss';

const drawerWidth = 500;
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		minWidth: 'min-h-full',
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		boxShadow: 'none',
		background: '#233F57',
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	hide: {
		display: 'none',
	},
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
const padStyle = { paddingTop: '143px' };
export const Home = () => {
	const dSOpen = detachStore(state => state.setOpen);

	const classes = useStyles();

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
		<div className={`${classes.root} min-h-screen root`}>
			<CssBaseline />
			<Header />
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="left"
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}>
				<Sidebar />
			</Drawer>
			<div
				className={clsx(classes.content, {
					[classes.contentShift]: open,
				})}>
				<div
					className="h-5"
					style={padStyle}
					// style={{ height: '20px', paddingTop: '130px' }}
				>
					<div
						className="fixed w-full py-3 "
						style={{ background: '#8999A6', height: '65px' }}>
						{!detachSidebar ? (
							<div
								onKeyDown={() => handleDrawerOpen}
								style={{
									paddingLeft: '3px',
									fontSize: 25,
									background: '#31506A',
									borderRadius: '0px 8px 8px 0px',
									width: '29px',
									height: '40px',
									color: 'white',
								}}
								role="button"
								tabIndex={0}
								color="inherit"
								aria-label="open drawer"
								onClick={handleDrawerOpen}
								className={clsx(
									classes.menuButton,
									open && classes.menuButton,
								)}>
								{open ? (
									<div>
										<ArrowBackIosIcon />
									</div>
								) : (
									<ArrowForwardIosIcon />
								)}
							</div>
						) : null}
					</div>
				</div>
				<div className={classes.drawerHeader} />
				<div className="p-12">{detachSidebar ? <Sidebar /> : null}</div>
			</div>
		</div>
	);
};
