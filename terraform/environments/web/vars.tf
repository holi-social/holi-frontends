locals {
  # predefined environment names are staging, production, and <branchname>
  environment        = terraform.workspace
  environment_name   = substr(local.environment, 0, 22) # limits the length of the name that it fits constraints google imposes for some resources, e.g. project ids
  # TODO unused parent_folder = local.environment == "main" ? data.terraform_remote_state.holi_mvp_shared_state.outputs.web_folder_id : data.terraform_remote_state.holi_mvp_shared_state.outputs.web_feature_environments_folder_id

  # the dns name can be at most 64 chars in total
  dns_name           = "${trimsuffix(substr(local.environment, 0, 39), ".-")}.${data.terraform_remote_state.holi_mvp_shared_state.outputs.dns_web_domain}"
  # in production, we work against prod apis, in staging and feature envs, we use the staging apis
  holi_api_url       = "https://${local.environment == "production" ? "production" : "staging"}.${data.terraform_remote_state.holi_unified_api_common_state.outputs.dns_unified_api_domain}/graphql"
}
