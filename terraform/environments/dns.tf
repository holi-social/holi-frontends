resource "google_dns_record_set" "app_web_domain_record_set" {
  managed_zone = local.dns_managed_zone
  name         = "${google_cloud_run_domain_mapping.app_web.name}."
  type         = google_cloud_run_domain_mapping.app_web.status[0].resource_records[0].type
  ttl          = 300
  rrdatas      = [google_cloud_run_domain_mapping.app_web.status[0].resource_records[0].rrdata]
}

output "app_domain" {
  value       = trimsuffix(google_dns_record_set.app_web_domain_record_set.name, ".")
  description = "Domain where the app resides"
}
