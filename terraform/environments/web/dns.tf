## these dns changes are done in the infra shared project (https://gitlab.com/holisticfoundation/holi-infra)
## because the zone web.project-holi.org is managed in that project.

resource "google_dns_record_set" "mvp_web_domain_record_set" {
  project      = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  managed_zone = data.terraform_remote_state.holi_mvp_shared_state.outputs.dns_web_domain_name
  name         = "${google_cloud_run_domain_mapping.mvp_web.name}."
  type         = google_cloud_run_domain_mapping.mvp_web.status[0].resource_records[0].type
  ttl          = 300
  rrdatas      = [google_cloud_run_domain_mapping.mvp_web.status[0].resource_records[0].rrdata]
}

output "app_domain" {
  value       = trimsuffix(google_dns_record_set.mvp_web_domain_record_set.name, ".")
  description = "Domain where the app resides"
}
