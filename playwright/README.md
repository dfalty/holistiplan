# Playwright Test Suite - HolistiPlan

This directory contains the automated test suite for the HolistiPlan application using Playwright with TypeScript.

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
npx playwright test
```

### Run Tests in Headed Mode (see browser)

```bash
npx playwright test --headed
```

### Run Specific Test File

```bash
npx playwright test authentication.test.ts
```

### Run Tests Matching a Pattern

```bash
npx playwright test --grep "should load home page"
```

### View Test Report

```bash
npx playwright show-report
```

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
- Documented bugs in `bug-report.md`
- Created test cases to inform automated test priorities

#### Automated Testing Focus

- **Critical Paths**: Authentication, core functionality
- **Data Integrity**: Points system, reward interactions
- **User Experience**: Form validation, error handling
