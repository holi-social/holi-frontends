# Terraform definitions for web

This folder contains definitions that are solely used by a single web environment. This enables us to 
create environments for feature branches / merge requests in git.

Anything that is used across multiple environments is defined in $PROJECT_ROOT/terraform.

## Feature Environments

We want to be able to deploy an environment for a feature branch.

We are using terraform workspaces (named after git branches) for this. By switching workspaces, we switch the google cloud infrastructure that composes the environment. Thereby, we achieve environments per branch, bootstrappable and destroyable via CI.