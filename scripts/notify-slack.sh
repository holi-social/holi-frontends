#!/usr/bin/env sh

# notify-slack.sh - Script to send release notifications to Slack
# Usage: ./notify-slack.sh [options]
#
# Options:
#   -w, --webhook URL       Slack webhook URL (required)
#   -r, --release TAG       Release tag (required)
#   -c, --color HEX         Avatar color (required)
#   -m, --message TEXT      Custom message text (required)
#   -h, --help              Show this help message

# Function to display usage information
show_help() {
    grep '^#' "$0" | grep -v '#!/bin/bash' | sed 's/^# //; s/^#//'
    exit 0
}

# Function to display error message and exit
error() {
    echo "ERROR: $1" >&2
    exit 1
}

# Initialize values
WEBHOOK=""
RELEASE=""
AVATAR_COLOR=""
MESSAGE=""

# Parse command-line arguments
while [ $# -gt 0 ]; do
    case "$1" in
        -w|--webhook)
            WEBHOOK="$2"
            shift
            shift
            ;;
        -r|--release)
            RELEASE="$2"
            shift
            shift
            ;;
        -c|--color)
            AVATAR_COLOR="$2"
            shift
            shift
            ;;
        -m|--message)
            MESSAGE="$2"
            shift
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Validate required parameters
[ -z "$WEBHOOK" ] && error "Webhook URL is required. Use -w or --webhook to specify."
[ -z "$RELEASE" ] && error "Release tag is required. Use -r or --release to specify."
[ -z "$AVATAR_COLOR" ] && error "Avatar color is required. Use -c or --color to specify."
[ -z "$MESSAGE" ] && error "Message text is required. Use -m or --message to specify."

# Escape special characters in strings for JSON
escape_json() {
    echo "$1" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\n/\\n/g; s/\r/\\r/g; s/\t/\\t/g'
}

strip_leading_whitespace() {
    # Read the input string, process each line to remove leading whitespace
    # and reconstruct the string with original line breaks
    echo "$1" | sed 's/^[[:space:]]*//'
}

RELEASE_ESCAPED=$(escape_json "$RELEASE")
MESSAGE_STRIPPED=$(strip_leading_whitespace "$MESSAGE")
MESSAGE_ESCAPED=$(escape_json "$MESSAGE_STRIPPED")

if command -v curl >/dev/null 2>&1; then
  curl -X POST -H "Content-Type: application/json" -s \
    --data '{"username": "'"$RELEASE_ESCAPED"' Release Status", "icon_url": "https://placehold.co/72x72/'"$AVATAR_COLOR"'/white?text='"$RELEASE_ESCAPED"'", "text": "'"$MESSAGE_ESCAPED"'"}' \
    "$WEBHOOK" 1> /dev/null || echo "WARNING: Failed to send notification to Slack."
else
  wget --quiet \
    --header="Content-Type: application/json" \
    --post-data='{"username": "'"$RELEASE_ESCAPED"' Release Status", "icon_url": "https://placehold.co/72x72/'"$AVATAR_COLOR"'/white?text='"$RELEASE_ESCAPED"'", "text": "'"$MESSAGE_ESCAPED"'"}' \
    -O /dev/null \
    "$WEBHOOK" || echo "WARNING: Failed to send notification to Slack."
fi