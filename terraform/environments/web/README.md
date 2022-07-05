# Terraform definitions for web

This folder contains definitions that are solely used by a single web environment. This enables us to
create environments for feature branches / merge requests in git.

Anything that is used across multiple environments is defined in $PROJECT_ROOT/terraform/common.

## Feature Environments

We want to be able to deploy an environment for a feature branch.

We are using terraform workspaces (named after git branches) for this. All infrastructure definitions in this folder are named relatively to the workspace. Therefore, on a workspace, we create/modify infrastructure only for the specific feature environment, without changing any infrastructure from other feature environments. Thereby, we achieve environments per branch, bootstrappable and destroyable via CI.
