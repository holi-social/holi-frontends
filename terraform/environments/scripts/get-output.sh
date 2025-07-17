#!/usr/bin/env sh

# exit when any command fails
set -ex

: "${1?"Usage: $0 OUTPUT_NAME"}"

pushd "$(dirname "$0")"/.. > /dev/null

terraform output -raw "$1"

popd