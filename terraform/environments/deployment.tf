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

  # keep this property as false. Having it true caused https://holi.atlassian.net/wiki/spaces/HOLI/pages/348258312/2023-06-27+All+services+down
  disable_dependent_services = false
  disable_on_destroy         = false
}

# in CI, this is set via scripts/create-or-update-env.sh
variable "image_tag" {
  type     = string
  nullable = false
}

locals {
  service_min_scale = {
    production = 1
    staging    = 1
  }
  service_max_scale = {
    production = 10
    staging    = 10
  }
}

resource "google_cloud_run_service" "mvp_web" {
  name     = random_id.main.hex
  location = local.default_region # finland, low CO2 emissions
  # https://github.com/hashicorp/terraform-provider-google/issues/5898
  autogenerate_revision_name = true

  template {
    spec {
      service_account_name = data.terraform_remote_state.holi_frontends_common_state.outputs.cloud_run_service_account_email
      containers {
        image = "${data.terraform_remote_state.holi_infra_state.outputs.artifact_registry_location}/holi-frontends-web:${var.image_tag}"
        ports {
          container_port = 3000
        }
        env {
          name  = "HOLI_API_URL"
          value = local.holi_api_url
        }
        env {
          name  = "HOLI_API_GATEWAY"
          value = local.holi_api_gateway
        }
        env {
          name  = "NEXT_PUBLIC_ENVIRONMENT_ID"
          value = local.environment
        }
        env {
          name = "POSTHOG_KEY"
          value_from {
            secret_key_ref {
              name = local.environment_name == "production" ? "POSTHOG_API_KEY_PRODUCTION" : "POSTHOG_API_KEY_DEVELOPMENT"
              key  = "latest"
            }
          }
        }
        env {
          name  = "POSTHOG_HOST"
          value = local.posthog_host
        }
        env {
          name  = "ORY_BASE_URL"
          value = local.environment == "production" ? "https://auth.holi.social" : "https://dev-auth.holi.social"
        }
        env {
          name  = "HOLI_CHALLENGES_APP"
          value = local.environment == "production" ? "https://challenges.holi.social" : "https://staging.challenges-dev.holi.social"
        }
        env {
          name = "ORY_ADMIN_ACCESS_TOKEN"
          value_from {
            secret_key_ref {
              name = local.environment_name == "production" ? "ORY_ACCESS_TOKEN_PRODUCTION" : "ORY_ACCESS_TOKEN_DEVELOPMENT"
              key  = "latest"
            }
          }
        }
        env {
          name  = "NEXT_PUBLIC_OWNCLOUD_BASE_URL"
          value = local.environment == "production" ? "https://production.cloud.holi.social" : "https://development.cloud.holi.social"
        }

        resources {
          limits = {
            # cpu can only be scaled down to 1000m as long as container_concurrency is set to != 1
            cpu    = local.environment == "production" ? "1000m" : "1000m"
            memory = local.environment == "production" ? "1024Mi" : "1024Mi"
          }
          requests = {
            cpu    = local.environment == "production" ? "1000m" : "1000m"
            memory = local.environment == "production" ? "1024Mi" : "1024Mi"
          }
        }
        startup_probe {
          initial_delay_seconds = 30
          period_seconds        = 5
          timeout_seconds       = 5
          failure_threshold     = 10
          http_get {
            path = "/"
          }
        }
      }
      container_concurrency = 100 # 0 means thread safe, no restriction on max concurrency
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale"         = lookup(local.service_min_scale, local.environment, "0")
        "autoscaling.knative.dev/maxScale"         = lookup(local.service_min_scale, local.environment, "2")
        "run.googleapis.com/execution-environment" = "gen1"
        "run.googleapis.com/startup-cpu-boost"     = "true"
      }
      # labels set on the revision level
      labels = {
        "environment_type" = local.environment_type
        "holi_service"     = "frontends-web"
      }
    }
  }

  metadata {
    # labels set on the service level
    labels = {
      "environment_type" = local.environment_type
      "holi_service"     = "frontends-web"
    }

  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.service]
}

resource "google_cloud_run_domain_mapping" "app_web" {
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

# monitoring

resource "google_monitoring_uptime_check_config" "mvp_web" {
  count            = terraform.workspace == "production" ? 1 : 0 # only monitor production because of cost
  display_name     = "Uptime Monitoring ${google_cloud_run_domain_mapping.app_web.name}"
  timeout          = "10s"
  period           = "900s"
  selected_regions = ["EUROPE", "ASIA_PACIFIC", "SOUTH_AMERICA"]

  http_check {
    path         = "/"
    port         = "443"
    use_ssl      = true
    validate_ssl = true
    accepted_response_status_codes {
      status_class = "STATUS_CLASS_2XX"
    }
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = "holi-shared"
      host       = google_cloud_run_domain_mapping.app_web.name
    }
  }
}
