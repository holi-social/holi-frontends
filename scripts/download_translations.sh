#!/bin/sh

set -eu

yarn i18n:download -- -q

git add .
git update-index --refresh
if ! git diff-index --cached --quiet HEAD --; then
    HAS_UPDATES=1
fi

if [ "${HAS_UPDATES:-}" ]; then
  echo "Updating translations"
  git commit -m 'chore(i18n): updating translations'
  git push origin "HEAD:${BRANCH}" -o ci.skip # prevent triggering pipeline again
else
   echo "No translations were updated"
fi
