#!/usr/bin/env sh
set -e

SOURCE="${1-$(git rev-parse --abbrev-ref HEAD)}"
TARGET="${2-main}"

echo "Using source ${SOURCE}"
echo "Using target ${TARGET}"

# Find the common ancestor commit (branch-off point)
MERGE_BASE=$(git merge-base "${SOURCE}" "${TARGET}")
echo "Branch-off point commit: $MERGE_BASE"

# Check out merge-base commit and count errors
git checkout "$MERGE_BASE"
yarn install --immutable # merge-base might have had different dependencies with different types
ERROR_COUNT_BEFORE=$(npx tsc --noEmit --pretty | grep 'Found .* errors\?' | sed -E 's/Found ([0-9]+) errors?.*/\1/')
echo "Errors at branch-off point: $ERROR_COUNT_BEFORE"

# Check out MR branch and count errors
git checkout "$SOURCE"
yarn install --immutable # MR branch might have had different dependencies with different types
ERROR_COUNT_AFTER=$(npx tsc --noEmit --pretty | grep 'Found .* errors\?' | sed -E 's/Found ([0-9]+) errors?.*/\1/')
echo "Errors in current branch: ${ERROR_COUNT_AFTER}"  # Compare error counts and fail if errors increased

if [ "$ERROR_COUNT_AFTER" -gt "$ERROR_COUNT_BEFORE" ]; then
  echo "❌ TypeScript errors increased from $ERROR_COUNT_BEFORE to $ERROR_COUNT_AFTER"
  exit 1
else
  ERRORS_REDUCED=$((ERROR_COUNT_BEFORE - ERROR_COUNT_AFTER))
  if [ $ERRORS_REDUCED -gt 10 ]; then
    echo "🎉 Fantastic job! You have reduced TypeScript errors by $ERRORS_REDUCED"
    echo "✨ Error count decreased from $ERROR_COUNT_BEFORE to $ERROR_COUNT_AFTER"
  else
    echo "✅ TypeScript errors remained same or decreased ($ERROR_COUNT_BEFORE -> $ERROR_COUNT_AFTER)"
  fi
fi
