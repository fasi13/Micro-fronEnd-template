import { AxiosError, AxiosResponse } from 'axios';
import {
	axiosContentDeliveryRequestInterceptor,
	axiosErrorRequestInterceptor,
	axiosErrorResponseInterceptor,
	axiosHierarchyClientRequestInterceptor,
	axiosSuccessResponseInterceptor,
} from '../axios';
import * as setupConfig from '../setupConfig';

const pageNotFound = 'Page not found';
const dummyResponseData: AxiosResponse = {
	config: { method: 'post' },
	headers: '',
	statusText: 'NotFound',
	status: 404,
	data: { message: pageNotFound },
};

const dummyErrorResponse: AxiosError = {
	config: { method: 'post' },
	isAxiosError: true,
	name: 'axios error',
	message: 'return error',
	toJSON: async () => null,
};

describe('axios', () => {
	describe('axiosSuccessResponseInterceptor', () => {
		it('should return the response', () => {
			const axiosResponse = {
				headers: {
					'x-access-token': 'access token',
					'x-refresh-token': 'refresh token',
				},
			};

			const response = axiosSuccessResponseInterceptor(axiosResponse as any);

			expect(response).toBe(response);
		});
	});
	describe('axiosContentDeliveryRequestInterceptor', () => {
		it('should get content delivery success request', async () => {
			jest.spyOn(setupConfig, 'configUrls').mockResolvedValueOnce({
				HIERARCHY_API: '',
				CONTENT_API: '',
			});
			const newConfig = await axiosContentDeliveryRequestInterceptor(
				dummyResponseData,
			);
			expect(newConfig.headers).toBe('');
			expect(newConfig.data.message).toBe(pageNotFound);
		});
	});

	describe('axiosHierarchyClientRequestInterceptor', () => {
		it('should get hierarchy client success request', async () => {
			jest.spyOn(setupConfig, 'configUrls').mockResolvedValueOnce({
				HIERARCHY_API: '',
				CONTENT_API: '',
			});
			const newConfig = await axiosHierarchyClientRequestInterceptor(
				dummyResponseData,
			);
			expect(newConfig.headers).toBe('');
			expect(newConfig.data.message).toBe(pageNotFound);
		});
	});

	describe('axiosErrorResponseInterceptor', () => {
		test('should reject with the error passed into it', async () => {
			await axiosErrorResponseInterceptor(dummyErrorResponse).catch(x => {
				expect(x.name).toBe('axios error');
			});
		});
	});

	describe('axiosErrorRequestInterceptor', () => {
		test('responseErrorHandler return', async () => {
			await axiosErrorRequestInterceptor(dummyErrorResponse).catch(x => {
				expect(x.isAxiosError).toBe(true);
			});
		});
	});
});
