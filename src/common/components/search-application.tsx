/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
	createStyles,
	ListItem,
	ListItemText,
	makeStyles,
	Typography,
} from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { ApplicationPath } from '../../types';

const useStyles = makeStyles(() =>
	createStyles({
		root: {
			borderBottom: '1px solid #dcdcdc',
		},
	}),
);

interface SearchApplicationProps {
	item: ApplicationPath;
}

export const SearchApplication = (props: SearchApplicationProps) => {
	const { item } = props;
	const classes = useStyles();

	const getApplicationName = ({ path }: ApplicationPath): string =>
		path[path.length - 1].name;

	const getApplicationValue = ({ path }: ApplicationPath): string =>
		path[path.length - 1].value;

	const getApplicationPath = (application: ApplicationPath): string => {
		const appPath = application.path;
		let strPath = '';
		appPath.slice(0, appPath.length - 1).forEach((element, index, array) => {
			if (element) {
				const separator = index === array.length - 1 ? '' : '>';
				const elementId = +element.value > -1 ? `(${element.value})` : '';
				strPath += `${element.value}${elementId}${separator}`;
			}
		});
		return strPath;
	};

	const getApplicationLink = ({ path }: ApplicationPath): string =>
		`tenant/${path[path.length - 1].id}/service/content`;

	return (
		<Router>
			<Link to={getApplicationLink(item)}>
				<ListItem className={classes.root}>
					<ListItemText
						primary={getApplicationName(item)}
						secondary={
							<>
								<Typography component="span" variant="body2">
									{getApplicationValue(item)}
								</Typography>{' '}
								<br />
								<Typography component="span" variant="body2">
									{getApplicationPath(item)}
								</Typography>
							</>
						}
					/>
				</ListItem>
			</Link>
		</Router>
	);
};
