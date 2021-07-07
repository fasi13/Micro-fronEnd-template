/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import {
	Breadcrumbs,
	createStyles,
	Link,
	LinkProps,
	ListItem,
	makeStyles,
	Typography,
} from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const breadcrumbNameMap: { [key: string]: string } = {
	'/home': 'Home',
	'/inbox/important': 'Important',
	'/trash': 'Trash',
	'/spam': 'Spam',
	'/drafts': 'Drafts',
	'/check': 'Check',
	'/check/check1': 'Check-1',
	'/check/check2': 'Check-2',
	'/check/check3': 'Check-3',
	'/check/check4': 'Check-4',
	'/check/check4/check5': 'Check-5',
	'/check/check4/check6': 'Check-6',
	'/check/check4/check7': 'Check-7',
	'/check/check4/check8': 'Check-8',
	'/check/check4/check8/check11': 'Check-11',
	'/check/check4/check8/check12': 'Check-12',
	'/check/check4/check8/check13': 'Check-13',
};

const useStyles = makeStyles(() =>
	createStyles({
		breadlink: {
			color: '#ffffff',
		},
		breadlinklast: {
			color: 'grey',
		},
	}),
);

interface LinkRouterProps extends LinkProps {
	to: string;
	replace?: boolean;
}

interface ListItemLinkProps extends LinkProps {
	to: string;
}

export const LinkRouter = (props: LinkRouterProps) => (
	<Link {...props} component={RouterLink as any} />
);

export function ListItemLink(props: Omit<ListItemLinkProps, 'ref'>) {
	const { to, ...other } = props;

	return <ListItem button component={RouterLink} to={to} {...other} />;
}

function Breadcrumbui({ pathnames }: any) {
	const classes = useStyles();

	return (
		<Breadcrumbs
			maxItems={3}
			aria-label="breadcrumb"
			className={classes.breadlink}>
			<LinkRouter color="inherit" to="/">
				E2E Group
			</LinkRouter>
			{pathnames.map((value: any, index: any) => {
				const last = index === pathnames.length - 1;
				const to = `/${pathnames.slice(0, index + 1).join('/')}`;

				return last ? (
					<Typography className={classes.breadlinklast} key={to}>
						{breadcrumbNameMap[to]}
					</Typography>
				) : (
					<LinkRouter color="inherit" to={to} key={to}>
						{breadcrumbNameMap[to]}
					</LinkRouter>
				);
			})}
		</Breadcrumbs>
	);
}

export default Breadcrumbui;
