# GitHub Actions CI/CD Workflows

## Overview

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. CI Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Lint**: Runs ESLint to check code quality
- **Test**: Runs Jest tests with coverage reporting
- **Build**: Builds the Next.js application
- **Report**: Generates summary reports

**Features:**
- ✅ Automated linting
- ✅ Test execution with coverage
- ✅ Coverage upload to Codecov
- ✅ Build verification
- ✅ Artifact uploads (coverage, build)

### 2. PR Checks (`pr-checks.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**Jobs:**
- **PR Validation**: Validates code quality and tests
- **Size Check**: Analyzes bundle size

**Features:**
- ✅ Automated PR comments with results
- ✅ Coverage threshold validation (80%)
- ✅ Bundle size analysis
- ✅ Detailed status reporting

## Setup Instructions

### 1. Required Secrets

Add these secrets to your GitHub repository:

```
Settings → Secrets and variables → Actions → New repository secret
```

**Optional Secrets:**
- `CODECOV_TOKEN` - For Codecov integration (get from codecov.io)

### 2. Enable GitHub Actions

1. Go to repository Settings
2. Navigate to Actions → General
3. Enable "Allow all actions and reusable workflows"
4. Set workflow permissions to "Read and write permissions"

### 3. Branch Protection Rules

Recommended settings for `main` branch:

```
Settings → Branches → Add branch protection rule
```

- ✅ Require status checks to pass before merging
  - CI Pipeline / lint
  - CI Pipeline / test
  - CI Pipeline / build
- ✅ Require pull request reviews before merging
- ✅ Require conversation resolution before merging

## Workflow Status Badges

Add these badges to your README.md:

```markdown
![CI Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)
![PR Checks](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/pr-checks.yml/badge.svg)
![Coverage](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO/branch/main/graph/badge.svg)
```

## Local Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run workflows locally
act push                    # Test push event
act pull_request           # Test PR event
act -j lint                # Run specific job
```

## Troubleshooting

### Workflow Fails on Lint

```bash
# Run locally to fix
npm run lint
```

### Workflow Fails on Tests

```bash
# Run locally to debug
npm test
npm run test:coverage
```

### Build Fails

```bash
# Test build locally
npm run build
```

### Coverage Upload Fails

- Check if `CODECOV_TOKEN` is set correctly
- Verify coverage files are generated in `coverage/` directory
- Check Codecov dashboard for errors

## Artifacts

### Coverage Reports
- **Location**: Workflow run → Artifacts
- **Retention**: 30 days
- **Contents**: HTML reports, lcov files, JSON summaries

### Build Output
- **Location**: Workflow run → Artifacts
- **Retention**: 7 days
- **Contents**: `.next/` directory

## Performance

### Typical Run Times
- Lint: ~30 seconds
- Test: ~1-2 minutes
- Build: ~2-3 minutes
- Total: ~4-6 minutes

### Optimization Tips
- Use `npm ci` instead of `npm install` (faster, deterministic)
- Enable caching for `node_modules`
- Run jobs in parallel when possible
- Use `continue-on-error` for non-critical steps

## Maintenance

### Regular Updates
- Update action versions quarterly
- Review and update Node.js version
- Monitor workflow run times
- Check for deprecated actions

### Monitoring
- Review failed workflow runs weekly
- Check artifact storage usage monthly
- Monitor Codecov trends
- Review PR check feedback

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Documentation](https://jestjs.io/)
- [Codecov Documentation](https://docs.codecov.com/)
- [Next.js CI Documentation](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)
