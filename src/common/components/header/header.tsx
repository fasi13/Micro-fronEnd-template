/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable dot-notation */
/* eslint-disable react/destructuring-assignment */
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
import { Breadcrumb } from '../breadcrumb/breadcrumb';
import './header.scss';

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

export const UserMenu = (props: any) => {
	const name = props?.nameOfUser === '' ? '?' : props.nameOfUser;
	const i = name
		.split(' ')
		.map((c: any) => c.charAt(0).toUpperCase())
		.join('')
		.concat(name.charAt(1).toUpperCase())
		.substring(0, 2);
	return (
		<Avatar
			data-testid="user-avatar"
			className={`${props.isOpened ? 'active' : ''}`}>
			{i}
		</Avatar>
	);
};

export const Header = () => {
	const [anchorEl, setAnchorEl] = React.useState(null);

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
					className="flex items-center justify-center py-3 pr-20 pl-14 ">
					<div className="text-2xl">
						<img src="/E2E_GROUP_LOGO_ORANGE.png" alt="E2E Logo" width="140" />
					</div>
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
								<span
									data-testid="menu-title"
									className="pl-2 text-base"
									style={{ color: '#BDC6CD' }}>
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
								disableScrollLock
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
								<UserMenu nameOfUser="Eyob Samuel" isOpened={anchorEl2} />
							</div>
							<Menu
								id="customized-menu2"
								anchorEl={anchorEl2}
								anchorOrigin={{ vertical: 55, horizontal: 'left' }}
								transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								getContentAnchorEl={null}
								open={Boolean(anchorEl2)}
								disableScrollLock
								onClose={handleClose2}>
								<AccountAvatar />
							</Menu>
						</div>
					</div>
				</div>
				<Breadcrumb />
			</AppBar>
		</div>
	);
};
