/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
	createStyles,
	ListItem,
	ListItemText,
	makeStyles,
} from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { ApplicationPath } from '../../../types';
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
		<>
			<Router>
				<Link to={getApplicationLink(item)}>
					<ListItem>
						<ListItemText
							className={classes.root}
							primary={
								<>
									<div className="flex flex-row pb-2">
										<div className="w-3/4 text-lg">
											{' '}
											<div>{getApplicationName(item)}</div>
										</div>
										<div className="w-1/4 text-right">
											<div className="text-sm">{getApplicationValue(item)}</div>
										</div>
									</div>
								</>
							}
							secondary={
								<>
									<div className="font-extralight pb-2">
										{getApplicationPath(item)}
									</div>
								</>
							}
						/>{' '}
					</ListItem>
				</Link>
			</Router>
		</>
	);
};
