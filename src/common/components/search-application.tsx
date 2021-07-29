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
import {
	getApplicationLink,
	getApplicationName,
	getApplicationPath,
	getApplicationValue,
} from './utils';

const useStyles = makeStyles(() =>
	createStyles({
		root: {
			borderBottom: '1px solid #dcdcdc',
		},
	}),
);

export interface SearchApplicationProps {
	item: ApplicationPath;
}

export const SearchApplication = (props: SearchApplicationProps) => {
	const { item } = props;
	const classes = useStyles();

	return (
		<Router>
			<Link to={getApplicationLink(item)}>
				<ListItem className={classes.root} divider>
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
