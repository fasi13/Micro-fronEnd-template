import axios from 'axios';
import { EnvConfig } from '../types';

let config: EnvConfig | null = null;

export const configUrls = async (): Promise<EnvConfig | null> => {
	try {
		const res = await axios.get<EnvConfig>(`${window.origin}/env-config.json`);
		config = res.data as unknown as EnvConfig;
		return config;
	} catch (e) {
		return null;
	}
};
