/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { createStyles, makeStyles, Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import React from 'react';
import { useBreadcrumbStore } from '../../../state';
import { NodePath } from '../../../types';
import { getButtonId } from './breadCrumbUtil';

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

function Breadcrumb() {
	const classes = useStyles();

	const { breadCrumbData, setBreadCrumb } = useBreadcrumbStore();

	const handleClick = (index: number) => {
		const pathNameUpdate: NodePath[] = [];

		const getId = breadCrumbData[index].pathName
			.split(' ')
			.join('_')
			.toLowerCase()
			.toString()
			.concat('____', getButtonId(breadCrumbData[index].pathId),
		);

		const el = document.getElementById(getId);

		for (let i = 0; i <= index; i++) {
			pathNameUpdate.push(breadCrumbData[i]);
		}
		setBreadCrumb(pathNameUpdate);
		el?.scrollIntoView(true);
	};

	return (
		<Breadcrumbs
			aria-label="breadcrumb"
			className={classes.link}
			data-testid="breadcrumbtest">
			{breadCrumbData.map((bread, index: number) =>
				breadCrumbData.length - 1 !== index ? (
					<Link
            data-testid="breadLink"
						key={bread.pathId.toString()}
						component="button"
						className={index !== 0 ? classes.link : classes.first}
						onClick={() => handleClick(index)}>{bread.pathName}</Link>
				) : (
					<Typography
						data-testid="disabledBreadLink"
						key={bread.pathId.toString()}
						className={index !== 0 ? classes.last : classes.first}>
						{bread.pathName}
					</Typography>
				),
			)}
		</Breadcrumbs>
	);
}

export default Breadcrumb;
