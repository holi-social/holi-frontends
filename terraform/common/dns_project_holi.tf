
### AUTH

resource "google_dns_record_set" "auth_project_holi_ory_custom_domain" {
  name         = "auth.${data.terraform_remote_state.holi_infra_state.outputs.dns_project_holi_sld_zone_domain}."
  project      = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  type         = "CNAME"
  ttl          = 300
  managed_zone = data.terraform_remote_state.holi_infra_state.outputs.dns_project_holi_sld_zone_name
  rrdatas = [
    "flamboyant-hopper-h35qftghn9.projects.oryapis.com."
  ]
}

resource "google_dns_record_set" "auth_project_holi_ory_custom_domain_dev" {
  name         = "dev-auth.${data.terraform_remote_state.holi_infra_state.outputs.dns_project_holi_sld_zone_domain}."
  project      = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  type         = "CNAME"
  ttl          = 300
  managed_zone = data.terraform_remote_state.holi_infra_state.outputs.dns_project_holi_sld_zone_name
  rrdatas = [
    "mystifying-carver-akajr6v4t8.projects.oryapis.com."
  ]
}
