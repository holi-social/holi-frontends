#!/usr/bin/env sh

# exit when any command fails
set -ex

# enable full debug output in terraform, which is only written to logfiles
export TF_LOG=TRACE

cd apps/web/terraform

WORKSPACE=$1

execute_plan() {
  PLAN_FILE="$1"
  TF_LOG_PATH="terraform-$PLAN_FILE.log" terraform plan \
    -out "$PLAN_FILE" \
    -no-color |
    tee tfplan.plain
}

TF_LOG_PATH=terraform-init.log terraform init
TF_LOG_PATH=terraform-version.log terraform version
TF_LOG_PATH=terraform-workspace.log terraform workspace new "$WORKSPACE" || terraform workspace select "$WORKSPACE"

execute_plan plan
TF_LOG_PATH=terraform-apply.log terraform apply -auto-approve -parallelism=50 plan
