/* eslint-disable no-undef */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: [
    "./config/testSetup.js"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*",
    "!node_modules/**",
    "!dist/**",
    "!src/PromisePortalProvider/__tests__/mockPortal.ts",
  ],
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100
  //   }
  // },
  modulePathIgnorePatterns: [
    "dist"
  ],
  testPathIgnorePatterns: [
    "src/PromisePortalProvider/__tests__/mockPortal.ts"
  ]
};