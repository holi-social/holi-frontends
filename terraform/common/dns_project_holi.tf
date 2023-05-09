locals {
  # effectively, this is web.project-holi.org
  project_holi_web_environments_zone_dns_name = "web.${data.terraform_remote_state.holi_infra_state.outputs.dns_project_holi_sld_zone_domain}."
}

# web environments zone
resource "google_dns_managed_zone" "project_holi_web_environments_zone" {
  project  = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name     = "web-environments-zone"
  dns_name = local.project_holi_web_environments_zone_dns_name
}

resource "google_dns_record_set" "project_holi_web_environments_zone_entry" {
  project = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name    = local.project_holi_web_environments_zone_dns_name
  type    = "NS"
  ttl     = 300

  managed_zone = data.terraform_remote_state.holi_infra_state.outputs.dns_project_holi_sld_zone_name

  rrdatas = google_dns_managed_zone.project_holi_web_environments_zone.name_servers
}

resource "google_dns_record_set" "project_holi_web_production_a" {
  name         = "production.${local.project_holi_web_environments_zone_dns_name}"
  project      = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  type         = "A"
  ttl          = 300
  managed_zone = google_dns_managed_zone.project_holi_web_environments_zone.name
  rrdatas = [
    "35.228.129.14"
  ]
}

output "dns_project_holi_web_domain" {
  value = trim(google_dns_managed_zone.project_holi_web_environments_zone.dns_name, ".")
}

output "dns_project_holi_web_domain_name" {
  value = google_dns_managed_zone.project_holi_web_environments_zone.name
}

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
