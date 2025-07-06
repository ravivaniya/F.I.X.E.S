#!/bin/bash

# Setup script for NextJS Auto-Fix Test Repository

echo "Setting up NextJS Auto-Fix Test Repository..."

# Create directory structure
mkdir -p .github/workflows
mkdir -p scripts
mkdir -p src/{components,pages/api,utils,styles}
mkdir -p tests/{components,utils}

# Install dependencies
npm install

# Create initial git commit
git init
git add .
git commit -m "Initial commit with intentional code issues for testing auto-fix workflow"

# Setup git hooks (optional)
echo "#!/bin/bash
npm run lint
npm run type-check" > .git/hooks/pre-commit

chmod +x .git/hooks/pre-commit

echo "Setup complete!"
echo "Repository is ready for testing the auto-fix workflow."
echo ""
echo "Next steps:"
echo "1. Push to GitHub Enterprise"
echo "2. Configure repository secrets (TEAMS_WEBHOOK_URL, COPILOT_TOKEN)"
echo "3. Enable code scanning"
echo "4. Wait for the auto-fix workflow to run"