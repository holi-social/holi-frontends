#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

url="$1"
number_of_consecutive_successful_tries_needed=10
number_of_consecutive_successful_tries_achieved=0

[ -z "$url" ] && echo "missing url as first param" && exit 1

echo -n "Checking if SSL certificate for $url is installed: "

# storage for the return value of the curl command
retval=0

# shellcheck disable=SC2034
for i in {1..900}; do
  set +e
  out=$(curl -sSLI "$url" 2>&1)
  retval=$?
  set -e
  # shellcheck disable=SC2181
  if [ $retval == 0 ]; then
    number_of_consecutive_successful_tries_achieved=$((number_of_consecutive_successful_tries_achieved + 1))
    echo "success (${number_of_consecutive_successful_tries_achieved})"
    if [ "$number_of_consecutive_successful_tries_achieved" -eq "$number_of_consecutive_successful_tries_needed" ]; then
      exit 0
    fi
  else
    echo -n "."
    number_of_consecutive_successful_tries_achieved=0
    sleep 1
  fi
done

echo -e "no success. Last output was:\n$out"
exit 1
