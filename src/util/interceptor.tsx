import { useEffect } from 'react';
import {
	HierarchyClient,
	requestErrorHandler,
	requestHandler,
	responseErrorHandler,
	responseHandler,
} from './axios';

export const InitAxiosInterceptors = () => {
	const initAxiosRequestInterceptors = () => {
		HierarchyClient.interceptors.request.use(
			request => requestHandler(request),
			error => requestErrorHandler(error),
		);
	};
	const initAxiosResponseInterceptor = () => {
		HierarchyClient.interceptors.response.use(
			response => responseHandler(response),
			error => responseErrorHandler(error?.response),
		);
	};

	useEffect(() => {
		initAxiosRequestInterceptors();
		initAxiosResponseInterceptor();
	}, []);

	return null;
};
