/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  coverageDirectory: "coverage",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  clearMocks: true,
  maxWorkers: 1,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 10000,

  // testMatch: [
  //   '**/__tests__/**/*.[jt]s?(x)',
  //   '!**/__tests__/coverage/**',
  //   '!**/__tests__/utils/**',
  //   '!**/__tests__/images/**',
  // ],
};
