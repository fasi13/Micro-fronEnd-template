import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const requestHandler = (request: AxiosRequestConfig) =>
	// Token will be dynamic so we can use any app-specific way to always
	// fetch the new token before making the call
	request;
const responseHandler = (response: AxiosResponse) => {
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data

	if (response?.status === 200 && response?.data?.success === false) {
		console.log('ERROR NOTIFY USER HERE__');
	}
	return response;
};

const errorHandler = (error: any) => {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error
	console.log('ERROR NOTIFY USER HERE?');
	return Promise.reject(error);
};

// console.log('??', process.env.REACT_APP_HIERARCHY_API);

const HierarchyClient = axios.create({
	baseURL: process.env.REACT_APP_CONTENT_API,
	headers: { 'Content-Type': 'application/json' },
});

const ContentClient = axios.create({
	baseURL: process.env.REACT_APP_HIERARCHY_API,
	headers: { 'Content-Type': 'application/json' },
});

HierarchyClient.interceptors.request.use(
	request => requestHandler(request),
	error => errorHandler(error),
);

HierarchyClient.interceptors.response.use(
	response => responseHandler(response),
	error => errorHandler(error),
);

ContentClient.interceptors.request.use(
	request => requestHandler(request),
	error => errorHandler(error),
);

ContentClient.interceptors.response.use(
	response => responseHandler(response),
	error => errorHandler(error),
);

export { HierarchyClient, ContentClient };
