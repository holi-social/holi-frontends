/**
 * The resource ids of resources must be unique. Since we might create resources for a branch multiple times
 * (after destroying the ones created before maybe failed, e.g. on environment cleanup, reopening a branch), we ensure uniqueness
 * by appending some random data to resource ids in order to avoid collisions.
 */
resource "random_id" "main" {
  byte_length = 2
  prefix      = "frontends-web-${local.environment_name}-"
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

# in CI, this is set via scripts/create-or-update-env.sh 
variable "image_tag" {
  type     = string
  nullable = false
}

resource "google_cloud_run_service" "mvp_web" {
  project  = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  name     = random_id.main.hex
  location = "europe-north1" # finland, low CO2 emissions

  template {
    spec {
      service_account_name = data.terraform_remote_state.holi_mvp_shared_state.outputs.cloud_run_service_account_email
      containers {
        image = "${data.terraform_remote_state.holi_infra_state.outputs.gcr_location}/holi-frontends-web:${var.image_tag}"
        ports {
          container_port = 3000
        }
        env {
          name  = "HOLI_API_URL"
          value = local.holi_api_url
        }
        env {
          name  = "NEXT_PUBLIC_ENVIRONMENT_ID"
          value = local.environment
        }

        resources {
          limits = {
            # cpu can only be scaled down to 1000m as long as container_concurrency is set to != 1
            cpu    = local.environment == "production" ? "1000m" : "1000m"
            memory = local.environment == "production" ? "512Mi" : "256Mi"
          }
          requests = {
            cpu    = local.environment == "production" ? "1000m" : "10m"
            memory = local.environment == "production" ? "512Mi" : "256Mi"
          }
        }
      }
      container_concurrency = 0 # 0 means thread safe, no restriction on max concurrency
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = local.environment == "production" ? "0" : "0"
        "autoscaling.knative.dev/maxScale" = local.environment == "production" ? "10" : "1"
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
  project = google_cloud_run_service.mvp_web.project
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

data "google_iam_policy" "mvp_web" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "mvp_web" {
  location = google_cloud_run_service.mvp_web.location
  project  = google_cloud_run_service.mvp_web.project
  service  = google_cloud_run_service.mvp_web.name

  policy_data = data.google_iam_policy.mvp_web.policy_data
}
