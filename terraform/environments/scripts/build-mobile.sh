#!/usr/bin/env sh

# exit when any command fails
set -ex

ENVIRONMENT_FILE=$1
BUILD_PROFILE=$2
BUILD_PLATFORM=$3
CHECK_VERSION_RELEASED=$4
CI_COMMIT_SHA=$5
CI_ARTIFACTS_ENVIRONMENT_NAME=$6
KEEP_ARTIFACTS=$7

echo "Loading environment from \"${ENVIRONMENT_FILE}\""
# shellcheck disable=SC1090
. "${ENVIRONMENT_FILE}"
cd apps/mobile
corepack enable
yarn install --immutable --immutable-cache

if [ "$CHECK_VERSION_RELEASED" = "true" ]; then
  case $BUILD_PLATFORM in
      ios ) VERSION_SELECTOR='.ios.buildNumber';;
      android ) VERSION_SELECTOR='.android.versionCode';;
      * ) echo "unknown build platform $BUILD_PLATFORM"; exit 1;;
  esac
  CURRENT_VERSION=$(expo config --json 2>/dev/null | jq -r $VERSION_SELECTOR)
  LAST_STATUS=$(eas build:list --json --non-interactive --platform "$BUILD_PLATFORM" --buildProfile "$BUILD_PROFILE" --limit=1 --app-version="$CURRENT_VERSION" 2>/dev/null | jq -r '.[0].status')
  if [ "$LAST_STATUS" != "" ] && [ "$LAST_STATUS" != "ERRORED" ] && [ "$LAST_STATUS" != "CANCELED" ]; then
    echo "$BUILD_PLATFORM app version \"$CURRENT_VERSION_IOS\" is/was already built (status $LAST_STATUS). Did you forget to increment app versions?"
    exit 1
  fi
fi

eas build --platform "$BUILD_PLATFORM" --profile "$BUILD_PROFILE" --non-interactive
ARTIFACT_URL=$(eas build:list --gitCommitHash "${CI_COMMIT_SHA}" --json --non-interactive --platform "$BUILD_PLATFORM" --limit=1 2> /dev/null | jq -r ".[0].artifacts.buildUrl") # extracts build URL from EAS

if [ "$KEEP_ARTIFACTS" = "true" ]; then
  mkdir -p artifacts_"$CI_ARTIFACTS_ENVIRONMENT_NAME"
  curl -o artifacts_"$CI_ARTIFACTS_ENVIRONMENT_NAME"/"$(basename "$ARTIFACT_URL")" "$ARTIFACT_URL"
fi
