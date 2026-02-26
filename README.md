# Playwright TypeScript Repository

This repository contains Playwright end-to-end tests (TypeScript) for the RealWorld Django + Angular app.

## Repository structure

```text
.
├── playwright.config.ts
├── tests/
│   ├── fixtures/
│   │   └── test.fixture.ts
│   ├── pages/
│   │   ├── article.page.ts
│   │   ├── editor.page.ts
│   │   ├── home.page.ts
│   │   ├── login.page.ts
│   │   ├── settings.page.ts
│   │   └── signup.page.ts
│   └── ui/
│       ├── articles.spec.ts
│       └── auth.spec.ts
└── realworld-django-rest-framework-angular/
```

## Test structure

- `tests/fixtures/`
	- Shared Playwright fixtures and test data setup.
	- `test.fixture.ts` extends Playwright `test` with page objects and API helpers (user/article creation).
- `tests/pages/`
	- Page Object Model classes for app areas (login, signup, home, editor, article, settings).
	- Encapsulates locators and reusable UI actions.
- `tests/ui/`
	- End-to-end specs grouped by business flows.
	- `auth.spec.ts` covers signup/login/logout scenarios.
	- `articles.spec.ts` covers create/edit/delete/feed/comment article flows.

## Prerequisites

- Node.js 18+
- npm

### Build the app locally

- Follow the README.md inside (realworld-django-rest-framework-angular) folder

- quick steps:
```bash
cd realworld-django-rest-framework-angular
docker compose up -d
```

- access the app at [http://localhost:4200]

## Install

```bash
npm install
```

## Update the .env file if necessary (optional)
- if your app is running at [http://localhost:4200], you don't have to change anything, otherwise change the BASE_URL in the .env file in the root folder to the correct url of your local instance

## Run tests from command line

- Run all tests:
```bash
npm run test
```
or
```bash
npx playwright test tests/ui/
```

- Run a single spec file:
```bash
npm run test tests/ui/articles.spec.ts
```
or
```bash
npx playwright test tests/ui/articles.spec.ts
```

- Run tests in ui mode:
```bash
npm run test:ui
```

- Run tests in headed mode:

```bash
npm run test:headed
```

- Debug mode:

```bash
npm run test:debug
```

- Open code generator:

```bash
npm run codegen
```
