#!/bin/sh

set -eu

CHANGES=$(git diff origin/main -- core/i18n/locales)

if [ -n "$CHANGES" ]; then
  printf "Continue to display which translations are likely to be changed (exit with q) [ENTER]: "
  read
  echo "$CHANGES" | less
else
  echo "There are no changes to upload."
  exit 1
fi

echo ""
echo "⚠️  WARNING: This action will upload all changes you just saw!"
echo ""
echo "Download the current translations with 'yarn i18n:download' before applying your changes if you are unsure."
echo ""

printf "Continue with upload? (y/N): "
read REPLY
echo ""

case "$REPLY" in
  [yY])
    echo "⬆️  Uploading translations now..."

    localazy upload -r $LOCALAZY_API_KEY_READ -w $LOCALAZY_API_KEY_WRITE
    ;;
  *)
    echo "🚫 Cancelled upload of translations"
    exit 1
    ;;
esac
