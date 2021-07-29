/* eslint-disable react/destructuring-assignment */
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
import ChangePasswordModal from '../changePasswordModal/changePasswordModal';
import { HeaderSecond } from '../headerSecond/headerSecond';
import './header.scss';

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
	const [anchorMenu, setAnchorMenu] = React.useState(null);

	const handleMenuOpen = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.key === 'Enter' || event.key === ' ')) ||
			event.type === 'click'
		)
			setAnchorMenu(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorMenu(null);
	};

	const [anchorAvatarMenu, setAnchorAvatarMenu] =
		React.useState<null | HTMLElement>(null);

	const handleAvatarOpen = (event: any) => {
		if (
			(event.type === 'keydown' &&
				(event.key === 'Enter' || event.key === ' ')) ||
			event.type === 'click'
		)
			setAnchorAvatarMenu(event.currentTarget);
	};

	const handleAvatarClose = () => {
		setAnchorAvatarMenu(null);
	};

	const showChangePassword = changePasswordModalStore(
		state => state.showChangePasswordModal,
	);
	const setShowChangePassword = changePasswordModalStore(
		state => state.setShowChangePasswordModal,
	);

	const handleChangePassword = () => {
		setAnchorAvatarMenu(null);
		setShowChangePassword(true);
	};
	const AccountAvatar = () => (
		<>
			<MenuItem
				data-testid="change-password-menu"
				onClick={handleChangePassword}>
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

	return (
		<div className="header-root">
			<AppBar position="fixed" className="header-appbar">
				<div className="flex justify-between  items-center  py-4 pr-20 pl-14 ">
					<div className="text-2xl">
						<img src="/E2E_GROUP_LOGO_ORANGE.png" alt="E2E Logo" width="140" />
					</div>
					<div className="flex items-center">
						<div>
							<div
								className="flex"
								data-testid="menu-title"
								onKeyDown={handleMenuOpen}
								role="button"
								tabIndex={0}
								aria-controls="customized-menu"
								aria-haspopup="true"
								color="primary"
								onClick={handleMenuOpen}>
								<ForumOutlinedIcon
									fontSize="large"
									style={{
										color: '#8C9DAC',
									}}
								/>
								<span className="pl-2 text-base" style={{ color: '#BDC6CD' }}>
									Manage Communication
								</span>

								<div
									data-testid="expand-menu-icon"
									className={`transition-transform transform  duration-200 ease-in-out ${
										anchorMenu ? 'rotate-180' : 'rotate-0'
									}`}>
									<ExpandMoreIcon
										fontSize="large"
										style={{
											color: '#B1C4D1',
											transitionProperty: 'transform',
										}}
									/>
								</div>
							</div>
							<Menu
								anchorEl={anchorMenu}
								anchorOrigin={{ vertical: 55, horizontal: 'center' }}
								transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								getContentAnchorEl={null}
								open={Boolean(anchorMenu)}
								disableScrollLock
								onClose={handleMenuClose}>
								<>
									<MenuItem
										className="gap-x-2 text-5xl"
										style={{ margin: '5px' }}>
										<ClientMgtIcon className="" width={40} height={40} />
										<ListItemText
											primary={
												<span
													data-testid="clntmgt"
													className="text-sm font-bold">
													CLIENT MANAGEMENT
												</span>
											}
										/>
									</MenuItem>
									<MenuItem className="gap-x-2" style={{ margin: '5px' }}>
										<ContentMgtIcon className="" width={40} height={40} />
										<ListItemText
											primary={
												<span
													data-testid="cntntmgt"
													className="text-sm font-bold">
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
											primary={
												<span className="text-sm font-bold">PROGRAMS</span>
											}
										/>
									</MenuItem>

									<MenuItem
										data-testid="price-settings"
										className="gap-x-2"
										style={{ margin: '5px' }}>
										<PriceIcon className="" width={40} height={40} />

										<ListItemText
											primary={
												<span className="text-sm font-bold">
													PRICE SETTINGS
												</span>
											}
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
												<span className="text-sm font-bold">
													INVOICE MANAGEMENT
												</span>
											}
										/>
									</MenuItem>
									<MenuItem
										data-testid="user-mgt"
										className="gap-x-2"
										style={{ margin: '5px' }}>
										<UserMgtIcon className="" width={40} height={40} />

										<ListItemText
											primary={
												<span className="text-sm font-bold">
													USER MANAGEMENT
												</span>
											}
										/>
									</MenuItem>
									<MenuItem
										data-testid="settings-mgt"
										className="gap-x-2"
										style={{ margin: '5px' }}>
										<SettingsIcon className="" width={40} height={40} />

										<ListItemText
											primary={
												<span className="text-sm font-bold">
													SETTINGS MANAGEMENT
												</span>
											}
										/>
									</MenuItem>
									<MenuItem
										data-testid="user-permission"
										className="gap-x-2"
										style={{ margin: '5px' }}>
										<PermissionIcon className="" width={40} height={40} />

										<ListItemText
											primary={
												<span className="text-sm font-bold">
													USER PERMISSION
												</span>
											}
										/>
									</MenuItem>
								</>
							</Menu>
						</div>
						<div className="pl-5">
							<div
								data-testid="menu-avatar"
								onKeyDown={handleAvatarOpen}
								role="button"
								tabIndex={0}
								aria-controls="customized-menu2"
								aria-haspopup="true"
								color="primary"
								onClick={handleAvatarOpen}>
								<UserMenu
									nameOfUser="Eyob Samuel"
									isOpened={anchorAvatarMenu}
								/>
							</div>
							<Menu
								data-testid="avatar-menu"
								id="customized-menu2"
								anchorEl={anchorAvatarMenu}
								anchorOrigin={{ vertical: 55, horizontal: 'left' }}
								transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								getContentAnchorEl={null}
								open={Boolean(anchorAvatarMenu)}
								disableScrollLock
								onClose={handleAvatarClose}>
								<AccountAvatar />
							</Menu>
						</div>
					</div>
				</div>
				<HeaderSecond />
			</AppBar>
			{showChangePassword ? (
				<div data-testid="change-password-modal">
					<ChangePasswordModal />
				</div>
			) : null}
		</div>
	);
};
