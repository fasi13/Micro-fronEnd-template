import { List, ListItemText } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import clsx from 'clsx';
import React from 'react';
import { ListItemLink } from '../../../Components/Breadcrumb/Breadcrumb-ui';
import Header from '../../../Components/Header/Header';
import Sidebar from '../../../Components/Sidebar/Sidebar';
import detachStore from '../../../state/detachSidebar.store';
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

export default function Home() {
	const ddd = detachStore(state => state.setOpen);

	const classes = useStyles();

	const open = detachStore(state => state.open);
	const tearSidebar = detachStore(state => state.detachSidebar);

	const handleDrawerOpen = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			ddd(!open);
	};

	return (
		<div className={classes.root}>
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
					<>
            <List>
              <ListItemLink to="/check/check1" key="home">
                <ListItemText primary="home" />
              </ListItemLink>
              <ListItemLink to="/trash" key="profile">
                <ListItemText primary="profile" />
              </ListItemLink>
            </List>
						<Typography paragraph>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua.
							Rhoncus dolor purus non enim praesent elementum facilisis leo vel.
							Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
							gravida rutrum quisque non tellus. Convallis convallis tellus id
							interdum velit laoreet id donec ultrices. Odio morbi quis commodo
							odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum
							est ultricies integer quis. Cursus euismod quis viverra nibh cras.
							Metus vulputate eu scelerisque felis imperdiet proin fermentum
							leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt
							lobortis feugiat vivamus at augue. At augue eget arcu dictum
							varius duis at consectetur lorem. Velit sed ullamcorper morbi
							tincidunt. Lorem donec massa sapien faucibus et molestie ac.
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
							Adipiscing elit duis tristique sollicitudin nibh sit. Ornare
							aenean euismod elementum nisi quis eleifend. Commodo viverra
							maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
							aliquam ultrices sagittis orci a.
						</Typography>
					</>
					{tearSidebar ? <Sidebar /> : null}
				</div>
			</div>
		</div>
	);
}
