import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import AccountTreeOutlinedIcon from '@material-ui/icons/AccountTreeOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import React from 'react';
import isTearedStore from '../../state/tearSidebar.store';

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

export default function HeaderTop() {
	const [anchorEl, setAnchorEl] = React.useState(null);

	const ddd = isTearedStore(state => state.setOpen);
	const eee = isTearedStore(state => state.setTearSidebar);
	const fff = isTearedStore(state => state.setLastSidebarOpen);

	const open = isTearedStore(state => state.open);
	const tearSidebar = isTearedStore(state => state.tearSidebar);
	const lastSidebarOpen = open;

	const setOpen = (opn: boolean) => {
		ddd(opn);
	};

	const setTearSidebar = (t: boolean) => {
		eee(t);
	};
	const setLastSidebarOpen = (last: boolean) => {
		fff(last);
	};

	const handleTear = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			if (!tearSidebar) {
				setLastSidebarOpen(open);
				setTearSidebar(true);
				setOpen(false);
			} else {
				setOpen(lastSidebarOpen);
				setTearSidebar(false);
				setOpen(true);
			}
	};

	const handleClick = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			setAnchorEl(event.currentTarget);
	};

	const handleClose = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			setAnchorEl(null);
	};
	const classes = useStyles();
	// const theme = useTheme();

	const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null);

	const handleClick2 = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			setAnchorEl2(event.currentTarget);
	};

	const handleClose2 = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.keyCode === 13 || event.keyCode === 32)) ||
			event.type === 'click'
		)
			setAnchorEl2(null);
	};

	const AccountAvatar = () => (
		<>
			<MenuItem>
				<ListItemText
					primary={<span className="text-sm">CHANGE PASSWORD</span>}
				/>
			</MenuItem>
			<MenuItem>
				<ListItemText primary={<span className="text-sm">LOGOUT</span>} />
			</MenuItem>
		</>
	);
	const ManageCommunicationMenuItems = () => (
		<>
			<MenuItem className="gap-x-2">
				<PeopleAltOutlinedIcon fontSize="small" />
				<ListItemText
					primary={<span className="text-sm">CLIENT MANAGEMENT</span>}
				/>
			</MenuItem>
			<MenuItem className="gap-x-2">
				<InsertDriveFileOutlinedIcon fontSize="small" />
				<ListItemText
					primary={<span className="text-sm">CONTENT MANAGEMENT</span>}
				/>
			</MenuItem>
			<MenuItem className="gap-x-2">
				<ForumOutlinedIcon fontSize="small" />
				<ListItemText
					primary={<span className="text-sm">MANAGE COMMUNICATION</span>}
				/>
			</MenuItem>
			<MenuItem className="gap-x-2">
				<ListAltOutlinedIcon fontSize="small" />
				<ListItemText primary={<span className="text-sm">PROGRAMS</span>} />
			</MenuItem>
			<MenuItem className="gap-x-2">
				<LocalOfferOutlinedIcon fontSize="small" />
				<ListItemText
					primary={<span className="text-sm">PRICE SETTINGS</span>}
				/>
			</MenuItem>

			<MenuItem className="gap-x-2">
				<AccountTreeOutlinedIcon fontSize="small" />
				<ListItemText primary={<span className="text-sm">ROLES</span>} />
			</MenuItem>
			<MenuItem className="gap-x-2">
				<ReceiptOutlinedIcon fontSize="small" />
				<ListItemText
					primary={<span className="text-sm">INVOICE MANAGEMENT</span>}
				/>
			</MenuItem>
			<MenuItem className="gap-x-2">
				<AccountCircleOutlinedIcon fontSize="small" />
				<ListItemText
					primary={<span className="text-sm">USER MANAGEMENT</span>}
				/>
			</MenuItem>
			<MenuItem className="gap-x-2">
				<SettingsOutlinedIcon fontSize="small" />
				<ListItemText
					primary={<span className="text-sm">SETTINGS MANAGEMENT</span>}
				/>
			</MenuItem>
			<MenuItem className="gap-x-2">
				<VerifiedUserOutlinedIcon fontSize="small" />
				<ListItemText
					primary={<span className="text-sm">USER PERMISSION</span>}
				/>
			</MenuItem>
		</>
	);
	return (
		<div className={classes.root}>
			{/* <CssBaseline /> */}
			<AppBar position="fixed" className={classes.appBar}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}
					className="flex justify-center pr-20 pl-14 py-3 items-center	">
					<div className="text-2xl">E2e Group</div>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div>
							<div
								onKeyDown={handleClick}
								role="button"
								tabIndex={0}
								aria-controls="customized-menu"
								aria-haspopup="true"
								color="primary"
								onClick={handleClick}>
								<ForumOutlinedIcon
									fontSize="large"
									style={{
										color: '#8C9DAC',
									}}
								/>
								<span className="pl-2 text-base" style={{ color: '#BDC6CD' }}>
									Manage Communication
								</span>
								<ExpandMoreIcon
									fontSize="large"
									style={{
										color: '#B1C4D1',
										transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
										transitionDuration: '200ms',
										transitionProperty: 'transform',
										transitionTimingFunction: 'ease-in-out',
									}}
								/>
							</div>
							<Menu
								anchorEl={anchorEl}
								anchorOrigin={{ vertical: 55, horizontal: 'center' }}
								transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								getContentAnchorEl={null}
								open={Boolean(anchorEl)}
								onClose={handleClose}>
								<ManageCommunicationMenuItems />
							</Menu>
						</div>
						<div style={{ paddingLeft: '20px' }}>
							<div
								onKeyDown={handleClick2}
								role="button"
								tabIndex={0}
								aria-controls="customized-menu2"
								aria-haspopup="true"
								color="primary"
								onClick={handleClick2}>
								<Avatar className={`${anchorEl2 ? 'active' : ''}`}>WW</Avatar>
							</div>
							<Menu
								id="customized-menu2"
								anchorEl={anchorEl2}
								anchorOrigin={{ vertical: 55, horizontal: 'left' }}
								transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								getContentAnchorEl={null}
								open={Boolean(anchorEl2)}
								onClose={handleClose2}>
								<AccountAvatar />
							</Menu>
						</div>
					</div>
				</div>
				<div className="py-4 pl-14 text-xl" style={{ background: '#31506A' }}>
					<div className="flex flex-wrap">
						<div
							onKeyDown={handleClick}
							role="button"
							tabIndex={0}
							aria-controls="customized-menu"
							aria-haspopup="true"
							color="primary"
							onClick={handleTear}>
							<svg
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
						<span className="pl-2">E2e Group</span>
					</div>
				</div>
			</AppBar>
		</div>
	);
}
