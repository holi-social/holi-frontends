# Web Testing

This spike uses codeceptjs as a high-level wrapper framework for mobile and web testing.

For testing the web app, start the local dev environment and execute the tests:

  `yarn install`

  `yarn web:dev`

  Open new terminal tab and run

  `yarn web:e2e`

  od

  `yarn web:e2e:headless`

## Troubleshooting

### Host system is missing dependencies to run browsers

Try running

```sh
npx playwright install-deps
```
