/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { createStyles, makeStyles, Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import React from 'react';
import { useBreadcrumbStore } from '../../../state';

const useStyles = makeStyles(() =>
	createStyles({
		link: {
			color: '#b6c0c8',
			fontSize: '1.2rem',
		},
		last: {
			color: 'grey',
			fontSize: '1.2rem',
		},
		first: {
			color: '#b6c0c8',
			fontSize: '1.6rem',
			fontWeight: 500,
		},
	}),
);

function Breadcrumbview() {
	const classes = useStyles();

	const { breadCrumbData, setBreadcrumb } = useBreadcrumbStore();

	const handleClick = (index: number) => {
		const pathNameUpdate: string[] = [];

		for (let i = 0; i <= index; i++) {
			pathNameUpdate.push(breadCrumbData[i]);
		}
		setBreadcrumb(pathNameUpdate);
	};

	return (
		<Breadcrumbs aria-label="breadcrumb" className={classes.link}>
			{breadCrumbData.map((bread, index: number) =>
				breadCrumbData.length - 1 !== index ? (
					<Link
						component="button"
						className={index !== 0 ? classes.link : classes.first}
						onClick={() => handleClick(index)}>
						{' '}
						{bread}{' '}
					</Link>
				) : (
					<Typography className={index !== 0 ? classes.last : classes.first}>
						{bread}
					</Typography>
				),
			)}
		</Breadcrumbs>
	);
}

export default Breadcrumbview;
