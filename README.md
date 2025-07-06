# NextJS Auto-Fix Test Repository

This repository is specifically designed to test the GitHub code scanning auto-fix workflow. It contains intentional code issues that demonstrate the workflow's capabilities.

## Issues Included

### TypeScript/ESLint Issues

- `@typescript-eslint/no-unused-vars` - Unused variables and parameters
- `@typescript-eslint/no-unused-expressions` - Unused expressions
- `@typescript-eslint/no-explicit-any` - Usage of `any` type
- `no-console` - Console.log statements
- `prefer-const` - Variables that should be const
- `no-var` - Usage of `var` instead of `let/const`

### File Coverage

- **Components**: Header, UserProfile, ProductCard
- **Pages**: Home, About, API routes
- **Utils**: Helper functions and constants
- **Tests**: Test files with issues
- **Config**: Next.js and Jest configurations

## Testing the Workflow

1. **Setup Repository**:
   ```bash
   npm install
   npm run setup
   ```
