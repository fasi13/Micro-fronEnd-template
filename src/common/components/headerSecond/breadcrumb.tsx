import React, { useEffect } from 'react';
import { useBreadcrumbStore, useHierarchyStore } from '../../../state';
import { NodePath } from '../../../types';
import './breadcrumb.css';
import { linkStyle, textStyle } from './breadCrumbStyleHelper';

export interface StyleProps {
	color: string;
}

const maxPathsToShow = 8;

let fullPath = '';
let ellipsisPosition = 0;
let pathList: NodePath[] = [];

const generateFullPath = (pathName: string) => {
	fullPath = fullPath ? `${fullPath} / ${pathName}` : pathName;
};

const ellipsisPositionGetter = (breadCrumbData: NodePath[]) => {
	ellipsisPosition =
		breadCrumbData.length > maxPathsToShow ? Math.ceil(maxPathsToShow / 2) : -1;

	if (ellipsisPosition > 0) {
		const limitPosition =
			breadCrumbData.length + ellipsisPosition - maxPathsToShow;

		let position = 0;

		breadCrumbData.forEach(path => {
			if (position <= ellipsisPosition || position > limitPosition) {
				pathList.push(path);
			}
			generateFullPath(path.pathName);
			position += 1;
		});
	} else {
		pathList = breadCrumbData;
	}
};

function Breadcrumb() {
	pathList = [];
	fullPath = '';

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

		for (let i = 0; i <= index; i += 1) {
			pathNameUpdate.push(breadCrumbData[i]);
		}

		setBreadCrumb(pathNameUpdate);
		el?.scrollIntoView(true);
	};

	ellipsisPositionGetter(breadCrumbData);

	useEffect(() => {
		setBreadCrumb([{ pathId: activeNodeId, pathName: nodeName }]);
	}, [activeNodeId, nodeName]);

	return (
		<ul
			className="flex flex-wrap text-base items-end"
			data-testid="breadcrumbtest">
			{pathList.map((bread, index) =>
				index !== pathList.length - 1 ? (
					<>
						<div key={bread.pathId.toString()}>
							<button
								type="button"
								onClick={() => handleClick(index)}
								className={linkStyle(index, 'link', 'first')}>
								{bread.pathName}
							</button>
						</div>
						<span className="text-breadNormal">&nbsp;/&nbsp;</span>
						{index === ellipsisPosition && (
							<>
								<span className="tooltip">
									<span className="text-small font-bold">&#8230;</span>
									<span className="tooltiptext">{fullPath}</span>
								</span>
								<span className="text-breadNormal">&nbsp;/&nbsp;</span>
							</>
						)}
					</>
				) : (
					<span
						key={bread.pathId.toString()}
						className={textStyle(index, 'last', 'first')}
						data-testid="disabledBreadLink">
						{bread.pathName}
					</span>
				),
			)}
		</ul>
	);
}

export default Breadcrumb;
