# Web Testing

This spike uses [Playwright](https://playwright.dev/) for web testing.

## Dependencies

You need to have Docker installed, because Playwright only supports Ubuntu.

## Credentials
The test for the login require working credentials. Please provide them in the .envrc.local file. The variable names are already there.

## Testing locally

For testing the web app locally, start the local dev environment from the root of the project with

  `yarn web:dev` 

and execute the tests from this directory:

  `yarn test:localhost`

if E2E_USER vars are not loaded you can try this
  
  `E2E_USER_USERNAME=... E2E_USER_PASSWORD=... yarn test:localhost`

For testing a deployed app, use the following commmand:

  `BASE_URL=https://staging.web.project-holi.org yarn test`

In order to debug failing tests, you can have a look at the trace that playwright saves for every test. The local command is:

`npx playwright show-trace test-results/Login-Login-should-not-work-with-invalid-credentials-chromium/trace.zip `
