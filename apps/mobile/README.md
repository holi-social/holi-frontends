# Mobile App

## EAS Build Environment Secrets
Expo offers a CLI to store secrets used during an EAS build. We currently use them to store `SENTRY_AUTH_TOKEN` and `EXPO_PROJECT_ID` to remove warnings from the developer environment.

### Requirements
It would help if you install the latest `eas` CLI to manage secrets locally. You can also manually update, add or remove secrets in our [Web Expo Dashboard](https://expo.dev/accounts/holistic-foundation/projects/projectholi/secrets)

```bash
# List all the store secrets
eas secret:list

# Set a secret
eas secret:create --scope project --name SECRET_NAME --value secretvalue --type string
```

For more information regarding secrets you can take a look at the official [documentation](eas secret:create --scope project --name SECRET_NAME --value secretvalue --type string
).