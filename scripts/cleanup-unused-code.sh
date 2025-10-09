#!/bin/bash

# Script to report unused code identified by knip
# Usage: ./scripts/cleanup-unused-code.sh [--detailed] [--summary]

set -e

DETAILED=false
SUMMARY_ONLY=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --detailed)
    DETAILED=true
    shift
    ;;
    --summary)
    SUMMARY_ONLY=true
    shift
    ;;
    -h|--help)
    echo "Usage: $0 [--detailed] [--summary]"
    echo "  --detailed: Show detailed file listings"
    echo "  --summary: Show only summary statistics"
    exit 0
    ;;
    *)
    echo "Unknown option $1"
    exit 1
    ;;
  esac
done

echo "🔍 Running knip to find unused code..."

# Run knip and capture output
cd core
KNP_OUTPUT=$(npx knip 2>&1 || true)
cd ..

if [[ $KNP_OUTPUT == *"No issues found"* ]]; then
  echo "✅ No unused code found!"
  exit 0
fi

# Extract the count of unused files
UNUSED_COUNT=$(echo "$KNP_OUTPUT" | grep -o "Unused files ([0-9]*)" | grep -o "[0-9]*" || echo "0")

echo "📊 Unused Code Report"
echo "===================="
echo "📁 Total unused files: $UNUSED_COUNT"
echo ""

if [[ "$SUMMARY_ONLY" == "true" ]]; then
  echo "💡 Run with --detailed to see the full file list"
  exit 0
fi

if [[ "$DETAILED" == "true" ]]; then
  echo "📋 Detailed file listing:"
  echo "$KNP_OUTPUT"
else
  echo "📋 Summary of unused files:"
  # Show first 20 files as a preview
  echo "$KNP_OUTPUT" | head -20
  if [[ $UNUSED_COUNT -gt 20 ]]; then
    echo "... and $((UNUSED_COUNT - 20)) more files"
  fi
  echo ""
  echo "💡 Run with --detailed to see the complete file list"
fi

echo ""
echo "🔧 Next steps:"
echo "  1. Review the files listed above"
echo "  2. Manually delete files you're sure are unused"
echo "  3. Update imports if any are broken"
echo "  4. Run 'cd core && npx knip' to verify cleanup"
