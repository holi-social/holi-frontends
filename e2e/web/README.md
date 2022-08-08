# Web Testing

This spike uses [Playwright](https://playwright.dev/) for web testing.

## Dependencies

You need to have Docker installed, because Playwright only supports Ubuntu.

## Credentials

The test for the login require working credentials. Please provide them in the .envrc.local file. The variable names are already there.

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
E2E_USER_USERNAME=... E2E_USER_PASSWORD=... yarn test:localhost
```

For testing a deployed app, use the following commmand:

```sh
BASE_URL=https://staging.web.project-holi.org yarn test
```

In order to debug failing tests, you can have a look at the trace that playwright saves for every test. The local command is:

```sh
npx playwright show-trace test-results/Login-Login-should-not-work-with-invalid-credentials-chromium/trace.zip
```

For actual debugging and "headed" execution you can also run the tests locally - this requires playwright to be installed (`npx playwright install`):

```sh
yarn test:debug
```

Selective testing for building tests can be done by using the `--grep @...` flag.

Selecting Profile tests only:

```sh
yarn test:localhost --grep @Profile
```

Or invert selective tests `--grep-invert @...`

### Troubleshooting

- Playwright can be really fast with clicks, when using animated views it might run into issues - it is recommended to add delay between steps.

- If an error like "Test timeout of 60000ms exceeded" occurs during CI in combination with "Target closed" in locally working tests, have a look at the overall execution time of the test - it might be that the timeout actually is not long enough and execution during CI just takes longer. (When the timeout is reached during test execution, the browser will be closed, causing Playwright to throw the error "Target closed" while searching for elements on the no longer existing page.)
  