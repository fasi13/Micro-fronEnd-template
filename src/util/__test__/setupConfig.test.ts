import axios from 'axios';
import { configUrls } from '../setupConfig';

describe('setupConfig', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('configUrls should be defined', () => {
		expect(typeof configUrls === 'function');
	});

	it('configUrls should call axios.get once', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementationOnce(() =>
			Promise.resolve({
				data: {
					HIERARCHY_API: '',
					CONTENT_API: '',
				},
			}),
		);
		await configUrls();
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('returns hierarchy_api and content_api base urls', async () => {
		const spy = jest.spyOn(axios, 'get').mockImplementationOnce(() =>
			Promise.resolve({
				data: {
					HIERARCHY_API: 'dummy',
					CONTENT_API: 'dummy',
				},
			}),
		);

		const result = await configUrls();
		expect(spy).toHaveBeenCalledWith(`${window.origin}/env-config.json`);
		expect(result).toMatchObject({
			HIERARCHY_API: 'dummy',
			CONTENT_API: 'dummy',
		});
	});

	it('returns null if it could not load env-config.json file', async () => {
		const spy = jest
			.spyOn(axios, 'get')
			.mockImplementationOnce(() => Promise.reject());

		const result = await configUrls();
		expect(spy).toHaveBeenCalledWith(`${window.origin}/env-config.json`);
		expect(result).toBeNull();
	});
});
