import { AxiosError, AxiosResponse } from 'axios';
import {
	axiosErrorRequestInterceptor,
	axiosErrorResponseInterceptor,
	axiosSuccessRequestInterceptor,
	axiosSuccessResponseInterceptor,
} from './axios';

const dummyResponseData: AxiosResponse = {
	config: { method: 'post' },
	headers: '',
	statusText: 'NotFound',
	status: 404,
	data: { message: 'Page not found' },
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
	describe('axiosSuccessRequestInterceptor', () => {
		it('should get ta success request', async () => {
			// (dummyResponseData as unknown as jest.Mock).mockReturnValueOnce(
			// 	'Page not found',
			// );

			const newConfig = await axiosSuccessRequestInterceptor(dummyResponseData);

			expect(newConfig.headers).toBe('');
			expect(newConfig.data.message).toBe('Page not found');
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
