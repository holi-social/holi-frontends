locals {
  # effectively, this is dev.holi.social
  dev_environments_zone_dns_name = "dev.${data.terraform_remote_state.holi_infra_state.outputs.dns_sld_zone_domain}."
}

# dev environments zone (development)
resource "google_dns_managed_zone" "dev_environments_zone" {
  name     = "dev-environments-zone"
  dns_name = local.dev_environments_zone_dns_name
}

resource "google_dns_record_set" "dev_environments_zone_entry" {
  name = local.dev_environments_zone_dns_name
  type = "NS"
  ttl  = 300

  managed_zone = google_dns_managed_zone.dev_environments_zone.name

  rrdatas = google_dns_managed_zone.dev_environments_zone.name_servers
}

output "dns_dev_domain" {
  value = trim(google_dns_managed_zone.dev_environments_zone.dns_name, ".")
}

output "dns_dev_domain_name" {
  value = google_dns_managed_zone.dev_environments_zone.name
}
