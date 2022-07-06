# Web Testing

This spike uses [Playwright](https://playwright.dev/) for web testing.

## Dependencies

You need to have Docker installed, because Playwright only supports Ubuntu.

## Testing locally

For testing the web app locally, start the local dev environment from the root of the project with

  `yarn web:dev` 

and execute the tests from this directory:

  `yarn test:localhost`

For testing a deployed app, use the following commmand:

  `BASE_URL=https://staging.web.project-holi.org yarn test`
