/**
 * the project id of projects must be globally unique. Since we might create a project for a branch multiple times,
 * and a project is not deleted instantly, but sticks around for 30 days, we need to append some random data to the
 * project id in order to avoid collisions.
 */
resource "random_id" "main" {
  byte_length = 2
  prefix      = "${local.project_name}-"
}

/*resource "google_project" "mvp_web" {
  name            = local.project_name
  project_id      = random_id.main.hex
  folder_id       = local.parent_folder
  billing_account = data.terraform_remote_state.holi_infra_state.outputs.billing_account_id

  provisioner "local-exec" {
    # https://github.com/terraform-providers/terraform-provider-google/issues/5649
    # not fully fixed yet
    # raised to 30 after 
    /*
      Error: googleapi: Error 412: One or more users named in the policy do not belong to a permitted customer., conditionNotMet

        on project-main.tf line 262, in resource "google_storage_bucket" "gra":
       262: resource "google_storage_bucket" "gra" {
  -/
    command = "sleep 30"
  }

}*/

resource "google_project_service" "service" {
  for_each = toset([
    "run.googleapis.com",
    "servicemanagement.googleapis.com",
    "servicecontrol.googleapis.com",
    "endpoints.googleapis.com",
    //    "cloudbuild.googleapis.com",
  ])

  service = each.key

  project            = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  disable_on_destroy = false
}

resource "google_cloud_run_service" "mvp_web" {
  project  = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name     = random_id.main.hex
  location = "europe-north1" # TODO: non-static reference to default location

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
  location = "europe-north1"
  name     = local.dns_name

  metadata {
    namespace = google_cloud_run_service.mvp_web.project
  }

  spec {
    route_name = google_cloud_run_service.mvp_web.name
  }
}
