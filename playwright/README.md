# Playwright Test Suite - HolistiPlan

This directory contains the automated test suite for the HolistiPlan test application using Playwright with TypeScript.

## Setup Steps

1. **Install Node.js dependencies** (for frontend build tools and Playwright):

   ```bash
   npm install
   ```

2. **Install Playwright browsers**:

   ```bash
   npx playwright install
   ```

3. **Start the Django application** (backend):

   ```bash
   docker-compose -f local.yml up django postgres redis -d
   ```

## How to Run the Tests

### Run All Tests

```bash
npx playwright test --workers 1
```

### Run Tests in Headed Mode (see browser)

```bash
npx playwright test --headed --workers 1
```

### Run Specific Test File

```bash
npx playwright test authentication.test.ts
```

### Run Tests Matching a Pattern

```bash
npx playwright test --grep "should load home page"
```

### Run Tests with Multiple Workers

```bash
npx playwright test --workers 5
```

Note: This approach caused performance issues in my environment and led to page load failures and test timeouts. Consider allocating additional CPU/memory resources.

### View Test Report

```bash
npx playwright show-report
```

### Test Failures

**Note**: You might encounter test failures due to the application hanging occasionally. I found that disabling the Django debug toolbar helped a lot with this, but you may still see some page load timeouts. Check the [bug report](./bug-report.md) for more details.

## Test Structure

The test suite is organized into the following directory structure:

```
playwright/
├── pages/                   # Page Object Models
├── tests/                   # Test files
├── test-data/               # Test data and fixtures
├── playwright.config.ts     # Playwright configuration
├── bug-report.md            # Manual testing findings
└── README.md
```

### Pages Directory

Contains Page Object Models (POM) that encapsulate page-specific interactions:

- **Base Page**: Common navigation and shared functionality
- **Feature Pages**: Specific page interactions (login, signup, home, etc.)
- **Methods**: Reusable actions like form filling, navigation, and assertions

### Tests Directory

Contains the actual test files organized by feature:

- **Authentication Tests**: Login, signup, logout flows
- **Home Page Tests**: Points system, reward interactions
- **Navigation Tests**: Basic navigation functionality

### Test-Data Directory

Contains test data and fixtures:

- **Auth Data**: Valid/invalid user credentials
- **Reward Data**: Reward definitions and expected values

## Approach

### Why TypeScript + Playwright?

I chose **TypeScript** and **Playwright** for this assignment based on my recent experience with this stack, allowing me to build the test suite quickly and efficiently. The tests could easily be ported to Python or other testing frameworks if needed.

### Testing Strategy

#### Manual Testing First

- Conducted exploratory testing to understand the application
- Documented bugs in [bug-report.md](./bug-report.md)
- Created test cases to inform automated test priorities

#### Automated Testing Focus

- **Authentication**: Log In, Data Persistence, Sign Up
- **Rewards & Redemption Flows**: Points, Reward Redemption, Main application functionality

These areas represent the most important user journeys and business-critical functionality.

#### Fix Bugs

During test development, several tests failed as expected due to bugs discovered in the application. I tried to fix the issues to ensure a passing test suite. For detailed information about all identified bugs and their resolution status, see [bug-report.md](./bug-report.md).
