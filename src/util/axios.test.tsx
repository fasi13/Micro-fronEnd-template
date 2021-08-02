import { render } from '@testing-library/react';
import { AxiosResponse } from 'axios';
import React from 'react';
import { ErrorResponse } from '../types';
import {
	HierarchyClient as interceptor,
	requestErrorHandler,
	responseErrorHandler,
	responseHandler,
} from './axios';
import { InitAxiosInterceptors } from './interceptor';

const dummyResponseData: AxiosResponse = {
	config: { method: 'post' },
	headers: '',
	statusText: 'NotFound',
	status: 404,
	data: { message: 'Page not found' },
};

const dummyErrorResponse: AxiosResponse<ErrorResponse> = {
	config: { method: 'post' },
	headers: '',
	statusText: 'NotFound',
	status: 404,
	data: {
		title: 'error',
		status: 500,
		errorCode: 435,
		errors: ['Dummy Error'],
	},
};

describe('axios interceptors', () => {
	test('requestErrorHandler return', async () => {
		let rejectRequest = '';
		await requestErrorHandler('page Not Found').catch(resp => {
			rejectRequest = resp;
		});
		expect(rejectRequest).toBe('page Not Found');
	});

	test('responseErrorHandler return', async () => {
		await responseErrorHandler(dummyErrorResponse).catch(x => {
			expect(x.title).toBe('error');
		});
	});

	test('interceptors.response is called', async () => {
		jest.spyOn(interceptor, 'get').mockResolvedValue('');
		const responseUseSpy = jest.spyOn(interceptor.interceptors.response, 'use');
		render(<InitAxiosInterceptors />);
		expect(responseUseSpy).toHaveBeenCalledTimes(1);
	});
	test('responseHandler error response ', () => {
		const resp = responseHandler(dummyResponseData);
		expect(resp.data.message).toBe('Page not found');
	});

	test('interceptor', async () => {
		jest.spyOn(interceptor, 'get').mockResolvedValue('');
		const requestUseSpy = jest.spyOn(interceptor.interceptors.request, 'use');
		render(<InitAxiosInterceptors />);
		expect(requestUseSpy).toHaveBeenCalledTimes(1);
	});
});
