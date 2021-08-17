import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { configUrls } from './setupConfig';

const HierarchyClient = axios.create({
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Headers': 'content-type',
	},
});
export const axiosHierarchyClientRequestInterceptor = async (
	request: AxiosRequestConfig,
): Promise<any> => {
	const urls = await configUrls();
	request.baseURL = urls?.HIERARCHY_API;
	return request;
};

export const axiosContentDeliveryRequestInterceptor = async (
	request: AxiosRequestConfig,
): Promise<any> => {
	const urls = await configUrls();
	request.baseURL = urls?.CONTENT_API;
	return request;
};

export const axiosErrorRequestInterceptor = (error: any) =>
	Promise.reject(error);

export const axiosErrorResponseInterceptor = (error: AxiosError) =>
	Promise.reject(error);
export const axiosSuccessResponseInterceptor = (response: AxiosResponse) =>
	response;

HierarchyClient.interceptors.response.use(
	axiosSuccessResponseInterceptor,
	axiosErrorResponseInterceptor,
);
HierarchyClient.interceptors.request.use(
	axiosHierarchyClientRequestInterceptor,
	axiosErrorRequestInterceptor,
);

const ContentDeliveryClient = axios.create({
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Headers': 'content-type',
		Authorization: 'Basic dGVzdDp0ZXN0',
	},
});

ContentDeliveryClient.interceptors.response.use(
	axiosSuccessResponseInterceptor,
	axiosErrorResponseInterceptor,
);
ContentDeliveryClient.interceptors.request.use(
	axiosContentDeliveryRequestInterceptor,
	axiosErrorRequestInterceptor,
);
export { ContentDeliveryClient, HierarchyClient };
