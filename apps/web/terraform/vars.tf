locals {
  # predefined environment names are staging, production, and tf-<branchname>
  environment   = terraform.workspace
  project_name  = substr(local.environment, 0, 23)
  parent_folder = local.environment == "main" ? data.terraform_remote_state.holi_mvp_shared_state.outputs.web_folder_id : data.terraform_remote_state.holi_mvp_shared_state.outputs.web_feature_environments_folder_id
  dns_name      = "${local.environment}.${data.terraform_remote_state.holi_mvp_shared_state.outputs.dns_web_domain}"
}
