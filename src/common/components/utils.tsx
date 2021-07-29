import { ApplicationPath } from '../../types';

export const getApplicationName = ({ path }: ApplicationPath): string =>
	path[path.length - 1].name;

export const getApplicationValue = ({ path }: ApplicationPath): string =>
	path[path.length - 1].value;

export const getApplicationLink = ({ path }: ApplicationPath): string =>
	`tenant/${path[path.length - 1].id}/service/content`;

export const getApplicationPath = (application: ApplicationPath): string => {
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
