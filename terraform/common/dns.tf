locals {
  # effectively, these are app.holi.social and dev.holi.social
  app_environments_zone_dns_name = "app.${data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_domain}."
  dev_environments_zone_dns_name = "dev.${data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_domain}."
}


# dev environments zone (development)
resource "google_dns_managed_zone" "dev_environments_zone" {
  project  = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name     = "dev-environments-zone"
  dns_name = local.dev_environments_zone_dns_name
}

resource "google_dns_record_set" "dev_environments_zone_entry" {
  project = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name    = local.dev_environments_zone_dns_name
  type    = "NS"
  ttl     = 300

  managed_zone = data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_name

  rrdatas = google_dns_managed_zone.dev_environments_zone.name_servers
}

output "dns_dev_domain" {
  value = trim(google_dns_managed_zone.dev_environments_zone.dns_name, ".")
}

output "dns_dev_domain_name" {
  value = google_dns_managed_zone.dev_environments_zone.name
}


### AUTH

resource "google_dns_record_set" "auth_ory_custom_domain" {
  name         = "auth.${data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_domain}."
  project      = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  type         = "CNAME"
  ttl          = 300
  managed_zone = data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_name
  rrdatas = [
    "flamboyant-hopper-h35qftghn9.projects.oryapis.com."
  ]
}

resource "google_dns_record_set" "auth_ory_custom_domain_dev" {
  name         = "dev-auth.${data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_domain}."
  project      = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  type         = "CNAME"
  ttl          = 300
  managed_zone = data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_name
  rrdatas = [
    "mystifying-carver-akajr6v4t8.projects.oryapis.com."
  ]
}
