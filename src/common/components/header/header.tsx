/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable dot-notation */
/* eslint-disable react/destructuring-assignment */
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import React from 'react';
import { changePasswordModalStore } from '../../../state';
import {
	ClientMgtIcon,
	CommunicationIcon,
	ContentMgtIcon,
	InvoiceIcon,
	PermissionIcon,
	PriceIcon,
	ProgramsIcon,
	RolesIcon,
	SettingsIcon,
	UserMgtIcon,
} from '../../icons';
import { Breadcrumb } from '../breadcrumb/breadcrumb';
import ChangePasswordModal from '../changePasswordModal/changePasswordModal';
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

	const showChangePassword = changePasswordModalStore(
		state => state.showChangePasswordModal,
	);
	const setShowChangePassword = changePasswordModalStore(
		state => state.setShowChangePasswordModal,
	);

	const handleChangePassword = () => {
		setAnchorEl2(null);
		setShowChangePassword(true);
	};
	const AccountAvatar = () => (
		<>
			<MenuItem onClick={handleChangePassword}>
				<ListItemText
					data-testid="change-password"
					primary={<span className="text-sm font-bold">CHANGE PASSWORD</span>}
				/>
			</MenuItem>
			<MenuItem>
				<ListItemText
					data-testid="logout"
					primary={<span className="text-sm font-bold">LOGOUT</span>}
				/>
			</MenuItem>
		</>
	);

	const ManageCommunicationMenuItems = () => (
		<>
			<MenuItem className="gap-x-2 text-5xl" style={{ margin: '5px' }}>
				<ClientMgtIcon className="" width={40} height={40} />
				<ListItemText
					primary={
						<span data-testid="clntmgt" className="text-sm font-bold">
							CLIENT MANAGEMENT
						</span>
					}
				/>
			</MenuItem>
			<MenuItem className="gap-x-2" style={{ margin: '5px' }}>
				<ContentMgtIcon className="" width={40} height={40} />
				<ListItemText
					primary={
						<span data-testid="cntntmgt" className="text-sm font-bold">
							CONTENT MANAGEMENT
						</span>
					}
				/>
			</MenuItem>
			<MenuItem className="gap-x-2" style={{ margin: '5px' }}>
				<CommunicationIcon className="" width={40} height={40} />

				<ListItemText
					primary={
						<span
							data-testid="manage-communication"
							className="text-sm font-bold">
							MANAGE COMMUNICATION
						</span>
					}
				/>
			</MenuItem>
			<MenuItem
				data-testid="programs"
				className="gap-x-2"
				style={{ margin: '5px' }}>
				<ProgramsIcon className="" width={40} height={40} />

				<ListItemText
					primary={<span className="text-sm font-bold">PROGRAMS</span>}
				/>
			</MenuItem>

			<MenuItem
				data-testid="price-settings"
				className="gap-x-2"
				style={{ margin: '5px' }}>
				<PriceIcon className="" width={40} height={40} />

				<ListItemText
					primary={<span className="text-sm font-bold">PRICE SETTINGS</span>}
				/>
			</MenuItem>
			<MenuItem
				data-testid="roles"
				className="gap-x-2"
				style={{ margin: '5px' }}>
				<RolesIcon className="" width={40} height={40} />

				<ListItemText
					primary={<span className="text-sm font-bold">ROLES</span>}
				/>
			</MenuItem>
			<MenuItem
				data-testid="invoice-mgt"
				className="gap-x-2"
				style={{ margin: '5px' }}>
				<InvoiceIcon className="" width={40} height={40} />

				<ListItemText
					primary={
						<span className="text-sm font-bold">INVOICE MANAGEMENT</span>
					}
				/>
			</MenuItem>
			<MenuItem
				data-testid="user-mgt"
				className="gap-x-2"
				style={{ margin: '5px' }}>
				<UserMgtIcon className="" width={40} height={40} />

				<ListItemText
					primary={<span className="text-sm font-bold">USER MANAGEMENT</span>}
				/>
			</MenuItem>
			<MenuItem
				data-testid="settings-mgt"
				className="gap-x-2"
				style={{ margin: '5px' }}>
				<SettingsIcon className="" width={40} height={40} />

				<ListItemText
					primary={
						<span className="text-sm font-bold">SETTINGS MANAGEMENT</span>
					}
				/>
			</MenuItem>
			<MenuItem
				data-testid="user-permission"
				className="gap-x-2"
				style={{ margin: '5px' }}>
				<PermissionIcon className="" width={40} height={40} />

				<ListItemText
					primary={<span className="text-sm font-bold">USER PERMISSION</span>}
				/>
			</MenuItem>
		</>
	);

	return (
		<div className={classes.root}>
			<AppBar position="fixed" className={classes.appBar}>
				<div className="flex justify-between  items-center  py-4 pr-20 pl-14 ">
					<div className="text-2xl">
						<img src="/E2E_GROUP_LOGO_ORANGE.png" alt="E2E Logo" width="140" />
					</div>
					<div className="flex items-center">
						<div>
							<div
								data-testid="menu-title"
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
									className={`transition-transform transform  duration-200 ease-in-out ${
										anchorEl ? 'rotate-180' : 'rotate-0'
									}`}
									style={{
										color: '#B1C4D1',
										transitionProperty: 'transform',
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
						<div className="pl-5">
							<div
								data-testid="menu-avatar"
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
			{showChangePassword ? <ChangePasswordModal /> : null}
		</div>
	);
};
