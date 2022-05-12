## these dns changes are done in the infra shared project

locals {
  # effectively, this is web.project-holi.org
  web_environments_zone_dns_name = "web.${data.terraform_remote_state.holi_infra_state.outputs.dns_sld_domain}."
}

# web environments zone
resource "google_dns_managed_zone" "web_environments_zone" {
  project  = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name     = "web-environments-zone"
  dns_name = local.web_environments_zone_dns_name
}

resource "google_dns_record_set" "web_environments_zone_entry" {
  project = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name    = local.web_environments_zone_dns_name
  type    = "NS"
  ttl     = 300

  managed_zone = data.terraform_remote_state.holi_infra_state.outputs.dns_sld_domain_name

  rrdatas = google_dns_managed_zone.web_environments_zone.name_servers
}

output "dns_web_domain" {
  value = trim(google_dns_managed_zone.web_environments_zone.dns_name, ".")
}

output "dns_web_domain_name" {
  value = google_dns_managed_zone.web_environments_zone.name
}

### AUTH

resource "google_dns_record_set" "auth_ory_custom_domain" {
  name         = "auth.${data.terraform_remote_state.holi_infra_state.outputs.dns_sld_domain}."
  project      = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  type         = "CNAME"
  ttl          = 300
  managed_zone = data.terraform_remote_state.holi_infra_state.outputs.dns_sld_domain_name
  rrdatas = [
    "mystifying-carver-akajr6v4t8.projects.oryapis.com."
  ]
}
