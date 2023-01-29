import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true
};

export default config;
