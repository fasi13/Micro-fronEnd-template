import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import { useChangePasswordModalStore, useHierarchyStore } from '../../../state';
import ChangePasswordModal from '../changePasswordModal/changePasswordModal';
import { HeaderSecond } from '../headerSecond/headerSecond';
import './header.scss';

const manageCommunicationMenuList = [
	{
		icon: '/icons/client-mgt.svg',
		title: 'CLIENT MANAGEMENT',
	},
	{
		icon: '/icons/content.svg',
		title: 'CONTENT MANAGEMENT',
	},
	{
		icon: '/icons/communication.svg',
		title: 'MANAGE COMMUNICATION',
	},
	{
		icon: '/icons/programs.svg',
		title: 'Programs',
	},
	{
		icon: '/icons/price.svg',
		title: 'PRICE SETTINGS',
	},
	{
		icon: '/icons/roles.svg',
		title: 'ROLES',
	},
	{
		icon: '/icons/invoice.svg',
		title: 'INVOICE MANAGEMENT',
	},
	{
		icon: '/icons/usermgt.svg',
		title: 'USER MANAGEMENT',
	},
	{
		icon: '/icons/settings.svg',
		title: 'SETTINGS MANAGEMENT',
	},
	{
		icon: '/icons/permission.svg',
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

	const { primaryLogo } = useHierarchyStore();

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

	const PrimaryLogo = () => (
		<div className="text-2xl ">
			{primaryLogo === '' ? (
				<img
					data-testid="default-logo"
					src="/e2e_default_logo.png"
					alt="E2E Logo"
					width="140"
				/>
			) : (
				<img
					data-testid="logo"
					src={primaryLogo}
					alt="E2E Logo"
					width="140"
					style={{ height: '50px' }}
				/>
			)}
		</div>
	);
	const [activeMenu, setActiveMenu] = React.useState(0);

	return (
		<div className="header-root">
			<AppBar position="fixed" className="header-appbar">
				<div className="flex items-center justify-between py-4 px-7">
					<PrimaryLogo />
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
								<img
									className="pr-2 selected-menu-img"
									src={manageCommunicationMenuList[activeMenu].icon}
									alt="menu"
									height="40"
									width="40"
								/>
								<span className="self-center px-1 text-sm font-bold text-lightgrayblue">
									{manageCommunicationMenuList[activeMenu].title}
								</span>

								<div
									data-testid="expand-menu-icon"
									className={`transition-transform transform  duration-200 ease-in-out ${anchorMenu ? 'rotate-180' : 'rotate-0'
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
								{manageCommunicationMenuList.map((menuTitle, index) => {
									const { title, icon } = menuTitle;
									return (
										<MenuItem
											key={`${title.split(' ').join('_')}`}
											data-testid={`${title.split(' ').join('_')}`}
											onClick={() => {
												setActiveMenu(index);
												handleMenuClose();
											}}>
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
