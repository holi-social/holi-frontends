# Terraform definitions for web

This folder contains definitions that are solely used by a single web environment. This enables us to 
create environments for feature branches / merge requests in git.

We are using terraform workspaces (named after git branches) for this. By switching workspaces, we switch the google cloud project
that contains the environment infrastructure. Thereby, we achieve environments per branch, bootstrappable and destroyable via CI.