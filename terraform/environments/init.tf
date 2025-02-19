terraform {
  backend "gcs" {
    bucket = "holi-shared-terraform-state"
    prefix = "frontends-environments"
  }
  required_providers {
    google = {
      version = "~> 6.0, !=6.21.0"
    }
    google-beta = {
      version = "~> 6.0, !=6.21.0"
    }
  }
}

data "terraform_remote_state" "holi_infra_state" {
  backend = "gcs"
  config = {
    bucket = "holi-shared-terraform-state"
    prefix = "infra"
  }
}

data "terraform_remote_state" "holi_frontends_common_state" {
  backend = "gcs"
  config = {
    bucket = "holi-shared-terraform-state"
    prefix = "frontends-common"
  }
}

data "terraform_remote_state" "holi_unified_api_common_state" {
  backend = "gcs"
  config = {
    bucket = "holi-shared-terraform-state"
    prefix = "unified-api-common"
  }
}


# provider google including beta features
provider "google" {
  project = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  region  = local.default_region
}

provider "google-beta" {
  project = data.terraform_remote_state.holi_infra_state.outputs.shared_project_id
  region  = local.default_region
}
