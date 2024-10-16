locals {
  # predefined environment names are staging, production, and <branchname>
  environment      = terraform.workspace
  environment_name = trim(substr(local.environment, 0, 22), ".-") # limits the length of the name that it fits constraints google imposes for some resources, e.g. project ids
  environment_type = contains(["staging", "production"], local.environment) ? local.environment : "review"

  # the dns name can be at most 64 chars in total
  dns_name         = local.environment == "production" ? "app.${data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_domain}" : "${trimsuffix(substr(local.environment, 0, 39), ".-")}.${data.terraform_remote_state.holi_frontends_common_state.outputs.dns_dev_domain}"
  dns_managed_zone = local.environment == "production" ? data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_name : data.terraform_remote_state.holi_frontends_common_state.outputs.dns_dev_domain_name
  # in production, we work against prod apis, in staging and feature envs, we use the staging apis
  holi_api_gateway = "https://${local.environment == "production" ? "production" : "staging"}.${data.terraform_remote_state.holi_unified_api_common_state.outputs.dns_unified_api_domain}"
  holi_api_url     = "${local.holi_api_gateway}/graphql"

  posthog_host = "https://eu.posthog.com"

  default_region = data.terraform_remote_state.holi_infra_state.outputs.default_region
}
