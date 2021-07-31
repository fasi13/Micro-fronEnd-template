import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorResponse } from '../types';

const requestHandler = (request: AxiosRequestConfig) =>
	// Token will be dynamic so we can use any app-specific way to always
	// fetch the new token before making the call
	request;
const responseHandler = (response: AxiosResponse) =>
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	response;

const requestErrorHandler = (error: any) => Promise.reject(error);

const responseErrorHandler = (error: AxiosResponse<ErrorResponse>) =>
	Promise.reject(error?.data);

const HierarchyClient = axios.create({
	baseURL: process.env.REACT_APP_CONTENT_API,
	headers: { 'Content-Type': 'application/json' },
});

HierarchyClient.interceptors.request.use(
	request => requestHandler(request),
	error => requestErrorHandler(error),
);

HierarchyClient.interceptors.response.use(
	response => responseHandler(response),
	error => responseErrorHandler(error?.response),
);

export { HierarchyClient };
