#!/bin/sh

set -eu

LOCAL_LOCALES_DIR="core/i18n/locales"
PATCH_FILE="local_i18n_changes.patch"
if [[ "${1:-}" == "--force" ]]; then
  echo ""
  echo "⚠️  WARNING: This action might override changes in Localazy!"
  echo ""

  printf "Continue with unchecked upload anyways? (y/N): "
  read REPLY
  echo ""

  case "$REPLY" in
    [yY])
      echo "⬆️  Uploading translations now..."

      localazy upload -r $LOCALAZY_API_KEY_READ -w $LOCALAZY_API_KEY_WRITE
      exit 0
      ;;
    *)
      echo "ℹ️  Continuing with checking translations before upload"
      echo ""
      ;;
  esac
fi

if ! git diff --quiet -- "${LOCAL_LOCALES_DIR}" || ! git diff --cached --quiet -- "${LOCAL_LOCALES_DIR}"; then
  echo "You have uncommitted changes in ${LOCAL_LOCALES_DIR}⚠️"
  echo "You need to commit your changes before the upload, so I can diff them (or stash your changes, if you don't want to apply them)."
  exit 1
fi

echo "🩹  Creating patch for local translation updates..."

git fetch origin main
git diff "origin/main...HEAD" -- "${LOCAL_LOCALES_DIR}" > "${PATCH_FILE}"


if [ -s "${PATCH_FILE}" ]; then
    echo "✅  Patch for translation changes created: ${PATCH_FILE}"
else
    echo "⚠️  No local changes detected since 'origin/main' in '${LOCAL_LOCALES_DIR}'."
    rm -f "${PATCH_FILE}"
    exit 1
fi

echo "---"
echo "Fetching newest translation snapshot..."
yarn i18n:download -- -q

if ! git diff --quiet -- "${LOCAL_LOCALES_DIR}"; then
    echo "✅  Remote changes detected and downloaded"

    echo "---"
    echo "🩹  Re-applying local changes from patch..."
    if git apply "${PATCH_FILE}"; then
        echo "✅  Local committed translation changes re-applied successfully."
    else
        echo "❌  Failed to apply patch '${PATCH_FILE}'. This likely indicates merge conflicts."
        echo "    Please review and resolve the conflicts manually in '${LOCAL_LOCALES_DIR}'."
        echo "    You can use 'git status' to see the conflicting files."
        rm "${PATCH_FILE}"
        exit 1
    fi
else
    echo "ℹ️  No remote changes detected, all safe to upload."
fi

rm "${PATCH_FILE}"

echo "⬆️  Uploading translations now..."

localazy upload -r $LOCALAZY_API_KEY_READ -w $LOCALAZY_API_KEY_WRITE
