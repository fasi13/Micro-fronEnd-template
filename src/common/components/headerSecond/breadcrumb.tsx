/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { createStyles, makeStyles, Typography } from '@material-ui/core';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import React, { useEffect } from 'react';
import { useBreadcrumbStore, useHierarchyStore } from '../../../state';
import { NodePath } from '../../../types';
import { linkStyle, textStyle } from './breadCrumbStyleHelper';

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

	const activeNodeId = useHierarchyStore(state => state.activeNodeId);
	const nodeName = useHierarchyStore(state => state.hierarchyData?.[0]?.name);

	const { breadCrumbData, setBreadCrumb } = useBreadcrumbStore();

	const handleClick = (index: number) => {
		const pathNameUpdate: NodePath[] = [];

		const getId = breadCrumbData[index].pathName
			.split(' ')
			.join('_')
			.toLowerCase()
			.toString()
			.concat('____', breadCrumbData[index].pathId.toString());

		const el = document.getElementById(getId);

		for (let i = 0; i <= index; i++) {
			pathNameUpdate.push(breadCrumbData[i]);
		}
		setBreadCrumb(pathNameUpdate);
		el?.scrollIntoView(true);
	};

	useEffect(() => {
		setBreadCrumb([{ pathId: activeNodeId, pathName: nodeName }]);
	}, [activeNodeId, nodeName]);

	return (
		<Breadcrumbs
			aria-label="breadcrumb"
			className={classes.link}
			data-testid="breadcrumbtest">
			{breadCrumbData.map((bread, index: number) =>
				breadCrumbData.length - 1 !== index ? (
					<Link
						key={bread.pathId.toString()}
						component="button"
						className={linkStyle(index, classes.link, classes.first)}
						onClick={() => handleClick(index)}>
						{bread.pathName}
					</Link>
				) : (
					<Typography
						data-testid="disabledBreadLink"
						key={bread.pathId.toString()}
						className={textStyle(index, classes.last, classes.first)}>
						{bread.pathName}
					</Typography>
				),
			)}
		</Breadcrumbs>
	);
}

export default Breadcrumb;
