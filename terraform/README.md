# Terraform shared infrastructure

This folder contains infrastructure that is neither globally shared across projects (that is in project holi-infra), 
nor environment/platform specific (web, android, ios). It does contain infrastructure that is platform
specific, but only available once, not once per environment.

Please take a look at the platform specific terraform definitions, especially web, to get the whole picture.