import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { useSearchStore } from '../../state';
import { ApplicationPath } from '../../types';

export const SearchApplication = () => {
	const { searchLoading, searchData } = useSearchStore();

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
		<List>
			{searchLoading ? (
				<p>Loading...</p>
			) : (
				searchData.map(item => (
					<Router>
						{' '}
						<Link to={getApplicationLink(item)}>
							<ListItem>
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
				))
			)}
		</List>
	);
};
