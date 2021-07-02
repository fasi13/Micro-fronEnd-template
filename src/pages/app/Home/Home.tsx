import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import clsx from 'clsx';
import React from 'react';
import { Rnd } from 'react-rnd';
import HeaderTop from '../../../Components/HeaderTop/HeaderTop';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import isTearedStore from '../../../state/tearSidebar.store';
import './home.scss';

const drawerWidth = 340;
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
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
		paddingTop: 130,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		// padding: theme.spacing(3),
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

export default function Home() {
	const ddd = isTearedStore(state => state.setOpen);
	const eee = isTearedStore(state => state.setTearSidebar);

	const setOpen = (opn: boolean) => {
		ddd(opn);
	};

	const setTearSidebar = (tear: boolean) => {
		setOpen(false);
		eee(tear);
	};

	const classes = useStyles();
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
	// const theme = useTheme();
	const open = isTearedStore(state => state.open);
	const tearSidebar = isTearedStore(state => state.tearSidebar);

	// const [open, setOpen] = React.useState(true);
	// const [tearSidebar, setTearSidebar] = useState(false);
	// const [lastSidebarOpen, setLastSidebarOpen] = React.useState(true);

	// const testt = (e: string) => <div>{e}</div>;

	const handleDrawerOpen = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			ddd(!open);
	};
	const handleUntear = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			setTearSidebar(false);

		// if (!tearSidebar) {
		// 	setLastSidebarOpen(open);
		// 	setTearSidebar(true);
		// 	setOpen(false);
		// } else {
		// 	setOpen(lastSidebarOpen);
		// 	setTearSidebar(false);
		// }
	};

	return (
		<div className={classes.root}>
			<CssBaseline />
			<HeaderTop />
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
				<div style={{ height: '20px', paddingTop: '130px' }}>
					<div
						className=" py-3 fixed w-full"
						style={{ background: '#8999A6', height: '65px' }}>
						{!tearSidebar ? (
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
				<div className="p-12">
					<Typography paragraph>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
						dolor purus non enim praesent elementum facilisis leo vel. Risus at
						ultrices mi tempus imperdiet. Semper risus in hendrerit gravida
						rutrum quisque non tellus. Convallis convallis tellus id interdum
						velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
						sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
						integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
						eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
						quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
						vivamus at augue. At augue eget arcu dictum varius duis at
						consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
						donec massa sapien faucibus et molestie ac.
					</Typography>
					<Typography paragraph>
						Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
						ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
						elementum integer enim neque volutpat ac tincidunt. Ornare
						suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
						volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
						Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
						ornare massa eget egestas purus viverra accumsan in. In hendrerit
						gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
						aliquam sem et tortor. Habitant morbi tristique senectus et.
						Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
						euismod elementum nisi quis eleifend. Commodo viverra maecenas
						accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
						ultrices sagittis orci a.
					</Typography>
					{tearSidebar ? (
						<Rnd
							style={style}
							default={{
								x: 0,
								y: 20,
								width: 320,
								height: 600,
							}}>
							<Sidebar />
							<div
								onKeyDown={() => handleUntear}
								role="button"
								tabIndex={0}
								aria-label="close-tear"
								style={{
									paddingLeft: '3px',
									fontSize: 25,
									background: '#31506A',
									borderRadius: '0px 8px 8px 0px',
									// width: '229px',
									height: '40px',
									color: 'white',
									boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
								}}
								id="icon"
								onClick={handleUntear}>
								x
							</div>
						</Rnd>
					) : null}
				</div>
			</div>
		</div>
	);
}
