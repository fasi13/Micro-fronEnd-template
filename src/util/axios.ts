import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const HierarchyClient = axios.create({
	baseURL: process.env.REACT_APP_HIERARCHY_API,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Headers': 'content-type',
	},
});
export const axiosSuccessRequestInterceptor = (request: AxiosRequestConfig) =>
	request;
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
	axiosSuccessRequestInterceptor,
	axiosErrorRequestInterceptor,
);

const ContentDeliveryClient = axios.create({
	baseURL: process.env.REACT_APP_CONTENT_API,
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
	axiosSuccessRequestInterceptor,
	axiosErrorRequestInterceptor,
);
export { ContentDeliveryClient, HierarchyClient };
