const nextJest = require("next/jest");

// Issue: unused variable
const testEnv = "jsdom";

const createJestConfig = nextJest({
  dir: "./",
});

// Issue: var usage
var customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom",
};

// Issue: console.log
console.log("Jest config loaded");

module.exports = createJestConfig(customJestConfig);
