/**
 * The resource ids of resources must be unique. Since we might create resources for a branch multiple times
 * (after destroying the ones created before maybe failed, e.g. on environment cleanup, reopening a branch), we ensure uniqueness
 * by appending some random data to resource ids in order to avoid collisions.
 */
resource "random_id" "main" {
  byte_length = 2
  prefix      = "${local.environment_name}-"
}

resource "google_project_service" "service" {
  for_each = toset([
    "run.googleapis.com",
    "servicemanagement.googleapis.com",
    "servicecontrol.googleapis.com",
    "endpoints.googleapis.com",
  ])

  service = each.key

  project            = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  disable_on_destroy = false
}

resource "google_cloud_run_service" "mvp_web" {
  project  = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name     = random_id.main.hex
  location = "europe-north1" # TODO: Frankfurt doesn't work, settle on a region here (north1 is finland and very co2 friendly)

  template {
    spec {
      containers {
        image = "${data.terraform_remote_state.holi_infra_state.outputs.gcr_location}/hrns:${local.environment}"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.service]
}

resource "google_cloud_run_domain_mapping" "mvp_web" {
  project  = google_cloud_run_service.mvp_web.project
  # location needs to be the same as the service's
  location = google_cloud_run_service.mvp_web.location
  name     = local.dns_name

  metadata {
    namespace = google_cloud_run_service.mvp_web.project
  }

  spec {
    route_name = google_cloud_run_service.mvp_web.name
  }
}
