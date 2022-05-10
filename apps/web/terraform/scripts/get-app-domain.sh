#!/usr/bin/env bash

# exit when any command fails
set -ex

cd apps/web/terraform > /dev/null

terraform output -raw app_domain
