locals {
  # predefined environment names are staging, production, and <branchname>
  environment      = terraform.workspace
  environment_name = substr(local.environment, 0, 22) # limits the length of the name that it fits constraints google imposes for some resources, e.g. project ids
  # TODO unused parent_folder = local.environment == "main" ? data.terraform_remote_state.holi_mvp_shared_state.outputs.web_folder_id : data.terraform_remote_state.holi_mvp_shared_state.outputs.web_feature_environments_folder_id
  dns_name = "${local.environment}.${data.terraform_remote_state.holi_mvp_shared_state.outputs.dns_web_domain}"
  # in staging and production envs, we are deploying the docker image built from the main branch
  docker_image_tag = contains(["staging", "production"], local.environment) ? "main" : local.environment
}
