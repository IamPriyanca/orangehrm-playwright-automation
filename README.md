# OrangeHRM Employee Lifecycle Automation

BDD-based UI and API automation framework using **Playwright, Cucumber, and TypeScript**.

## Tech Stack

- Playwright
- Cucumber / Gherkin
- TypeScript
- Node.js
- API Testing
- GitHub Actions

## Project Structure

```text
features/          # BDD feature files
step-definitions/  # Cucumber step definitions
pages/             # Page Object Model
hooks/             # Test setup and teardown
utils/             # API and reusable utilities
test-data/         # Test data
test-assets/       # Test files/assets
reports/           # Cucumber HTML report

# Prerequisites
Node.js
npm
Git

# Installation

git clone <repository-url>
npm install
npx playwright install
Create a .env file
npm run bdd