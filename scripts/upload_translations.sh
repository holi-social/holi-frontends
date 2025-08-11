#!/bin/sh

set -eu

LOCAL_LOCALES_DIR="core/i18n/locales"
PATCH_FILE="local_i18n_changes.patch"

git add .
git update-index --refresh
if ! git diff-index --cached --quiet HEAD --; then
    UNCOMMITTED_CHANGES=1
fi

if [ "${UNCOMMITTED_CHANGES:-}" ]; then
  echo "Please commit or stash all changes before continuing."
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

git add .
git update-index --refresh
if ! git diff-index --cached --quiet HEAD --; then
    REMOTE_HAS_UPDATES=1
fi

if [ "${REMOTE_HAS_UPDATES:-}" ]; then
    echo "✅  Remote changes detected and downloaded"
    git reset .

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
