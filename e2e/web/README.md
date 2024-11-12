# Web Testing

This spike uses [Playwright](https://playwright.dev/) for web testing.

## Dependencies

You need to have Docker installed, because Playwright only supports Ubuntu.

## Credentials

The test for the login require working credentials. Please provide them in the `.envrc.local` file. The variable names are already there.

## Testing selective browsers

You can test selective browsers from the command line by specifying an environment variable:

```sh
E2E_WEB_BROWSERS=Mobile_Chrome,Desktop_Firefox yarn test
```

Take a look in `playwright.config.ts` for valid browser names.

## Testing with retries

By default, local tests run without retries, but CI test runs use retries. Therefore, flaky tests can fail locally, but succeed in CI. If you want to test with retries locally, you can enable them via an environment variable:

```sh
E2E_WEB_RETRIES=2 yarn test
```

## Testing locally

For testing the web app locally, start the local dev environment from the root of the project with

```sh
yarn web:dev
```

and execute the tests from this directory:

```sh
yarn test:localhost
```

if E2E_USER vars are not loaded you can try this
  
```sh
E2E_USER_USERNAME=... E2E_USER_PASSWORD=... E2E_USER_ID=... yarn test:localhost
```

For testing a deployed app, use the following command:

```sh
BASE_URL=https://staging.dev.holi.social yarn test
```

In order to debug failing tests, you can have a look at the trace that playwright saves for every test. The local command is:

```sh
npx playwright show-trace test-results/Login-Login-should-not-work-with-invalid-credentials-chromium/trace.zip
```

For actual debugging and "headed" execution you can also run the tests locally - this requires playwright to be installed (`npx playwright install`):

```sh
yarn test:localhost:debug
```

Selective testing for building tests can be done by using the `--grep @...` flag.

Selecting Profile tests only:

```sh
yarn test:localhost --grep @Profile
```

Or invert selective tests `--grep-invert @...`


### Troubleshooting

- Playwright is really fast with clicks, which might uncover issues that don't appear in manual testing - they still are issues, though, either in the test itself or even in the application. Don't add delays to work around such test failures.

- If an error like "Test timeout of 60000ms exceeded" occurs during CI in combination with "Target closed" in locally working tests, have a look at the overall execution time of the test - it might be that the timeout actually is not long enough and execution during CI just takes longer. (When the timeout is reached during test execution, the browser will be closed, causing Playwright to throw the error "Target closed" while searching for elements on the no longer existing page.)
  