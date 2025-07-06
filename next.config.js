/** @type {import('next').NextConfig} */

// Issue: unused variable
const unusedConfig = "not used";

// Issue: var usage
var nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Run ESLint on build
    dirs: ["src", "pages", "components", "utils"],
  },
  typescript: {
    // Type checking during build
    tsconfigPath: "./tsconfig.json",
  },
};

// Issue: console.log
console.log("Next.js config loaded");

module.exports = nextConfig;
