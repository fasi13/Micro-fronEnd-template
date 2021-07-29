import { ApplicationPath } from '../../types';

export const getApplicationName = ({ path }: ApplicationPath): string =>
	path[path.length - 1].name;

export const getApplicationValue = ({ path }: ApplicationPath): string =>
	path[path.length - 1].value;

export const getApplicationLink = ({ path }: ApplicationPath): string =>
	`tenant/${path[path.length - 1].id}/service/content`;

export const getSeparator = (index: number, array: any): string =>
	index === array.length - 1 ? '' : '>';

export const getElementId = (element: any): string =>
	+element.value > -1 ? `(${element.value})` : '';

export const getApplicationPath = (application: ApplicationPath): string => {
	const appPath = application.path;

	let strPath = '';
	if (appPath.length > 1) {
		appPath.slice(0, appPath.length - 1).forEach((element, index, array) => {
			const elementId = getElementId(element);
			strPath += `${element.value}${elementId}${getSeparator(index, array)}`;
		});
	}
	return strPath;
};
