# Web Testing

This spike uses playwright for web testing.

For testing the web app locally, start the local dev environment from the root of the project with

  `yarn web:serve-e2e` 

and execute the tests from this directory:

  `yarn test:localhost`

For testing a deployed app, use the following commmand:

  `BASE_URL=https://staging.web.project-holi.org yarn test`
