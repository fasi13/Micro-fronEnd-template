import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import React from 'react';
import { useChangePasswordModalStore } from '../../../state';
import ChangePasswordModal from '../changePasswordModal/changePasswordModal';
import { HeaderSecond } from '../headerSecond/headerSecond';
import './header.scss';

const manageCommunicationMenuList = [
	{
		icon: '/client-mgt.svg',
		title: 'CLIENT MANAGEMENT',
	},
	{
		icon: '/content.svg',
		title: 'CONTENT MANAGEMENT',
	},
	{
		icon: '/communication.svg',
		title: 'MANAGE COMMUNICATION',
	},
	{
		icon: '/programs.svg',
		title: 'Programs',
	},
	{
		icon: '/price.svg',
		title: 'PRICE SETTINGS',
	},
	{
		icon: '/roles.svg',
		title: 'ROLES',
	},
	{
		icon: '/invoice.svg',
		title: 'INVOICE MANAGEMENT',
	},
	{
		icon: '/usermgt.svg',
		title: 'USER MANAGEMENT',
	},
	{
		icon: '/settings.svg',
		title: 'SETTINGS MANAGEMENT',
	},
	{
		icon: '/permission.svg',
		title: 'USER PERMISSION',
	},
];

export const UserMenu = (props: any) => {
	const { nameOfUser, isOpened } = props;
	const i =
		nameOfUser === ''
			? '?'
			: nameOfUser
					.split(' ')
					.map((c: any) => c.charAt(0).toUpperCase())
					.join('')
					.concat(nameOfUser.charAt(1).toUpperCase())
					.substring(0, 2);
	return (
		<Avatar data-testid="user-avatar" className={`${isOpened ? 'active' : ''}`}>
			{i}
		</Avatar>
	);
};

export const Header = () => {
	const [anchorMenu, setAnchorMenu] = React.useState(null);

	const handleMenuOpen = (event: any) => {
		setAnchorMenu(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorMenu(null);
	};

	const [anchorAvatarMenu, setAnchorAvatarMenu] =
		React.useState<null | HTMLElement>(null);

	const handleAvatarOpen = (event: any) => {
		setAnchorAvatarMenu(event.currentTarget);
	};

	const handleAvatarClose = () => {
		setAnchorAvatarMenu(null);
	};

	const showChangePassword = useChangePasswordModalStore(
		state => state.showChangePasswordModal,
	);
	const setShowChangePassword = useChangePasswordModalStore(
		state => state.setShowChangePasswordModal,
	);
	const handleChangePassword = () => {
		setAnchorAvatarMenu(null);
		setShowChangePassword(true);
	};
	return (
		<div className="header-root">
			<AppBar position="fixed" className="header-appbar">
				<div className="flex items-center justify-between py-4 px-7">
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
								<ForumOutlinedIcon className="text-balihai" fontSize="large" />
								<span className="self-center pl-2 text-base text-lightgrayblue">
									Manage Communication
								</span>

								<div
									data-testid="expand-menu-icon"
									className={`transition-transform transform  duration-200 ease-in-out ${
										anchorMenu ? 'rotate-180' : 'rotate-0'
									}`}>
									<ExpandMoreIcon fontSize="large" className="text-balihai " />
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
								{manageCommunicationMenuList.map(menuTitle => {
									const { title, icon } = menuTitle;
									return (
										<MenuItem>
											<div className="flex p-1 ">
												<img
													className="pr-2"
													src={icon}
													alt="menu"
													height="40"
													width="40"
												/>
												<ListItemText
													data-testid="change-password"
													primary={
														<span className="text-sm font-bold">{title}</span>
													}
												/>
											</div>
										</MenuItem>
									);
								})}
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
								<UserMenu nameOfUser="John Alen" isOpened={anchorAvatarMenu} />
							</div>

							<Menu
								data-testid="avatar-menu"
								id="customized-menu2"
								anchorEl={anchorAvatarMenu}
								anchorOrigin={{ vertical: 65, horizontal: 'left' }}
								transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								getContentAnchorEl={null}
								open={Boolean(anchorAvatarMenu)}
								disableScrollLock
								onClose={handleAvatarClose}>
								<MenuItem
									data-testid="change-password-menu"
									onClick={handleChangePassword}>
									<ListItemText
										data-testid="change-password"
										primary={
											<span className="text-sm font-bold">CHANGE PASSWORD</span>
										}
									/>
								</MenuItem>
								<MenuItem>
									<ListItemText
										data-testid="logout"
										primary={<span className="text-sm font-bold">LOGOUT</span>}
									/>
								</MenuItem>
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
