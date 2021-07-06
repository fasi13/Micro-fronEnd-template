// jest.config.ts
import type { Config } from '@jest/types';

// Or async function
export default async (): Promise<Config.InitialOptions> => ({
	verbose: true,
	testResultsProcessor: 'jest-junit',
	coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
	reporters: ['default', 'jest-junit'],
	moduleNameMapper: {
		'\\.(css|less|scss|sass|svg)$': '<rootDir>/config/CSSStub.js',
	},

	preset: 'ts-jest',
	transform: {
		'^.+\\.(ts|tsx)?$': 'babel-jest',
	},
});
