import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  preset: 'ts-jest',
  verbose: true
};

export default config;
