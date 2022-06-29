#!/usr/bin/env sh

# exit when any command fails
set -ex

cd "$(dirname "$0")"/.. > /dev/null

terraform output -raw app_domain
