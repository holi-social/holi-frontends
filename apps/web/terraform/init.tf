terraform {
  backend "gcs" {
    bucket = "holi-shared-terraform-state"
    prefix = "mvp-web"
  }
}

data "terraform_remote_state" "holi_infra_state" {
  backend = "gcs"
  config = {
    bucket = "holi-shared-terraform-state"
    prefix = "infra"
  }
}

data "terraform_remote_state" "holi_mvp_shared_state" {
  backend = "gcs"
  config = {
    bucket = "holi-shared-terraform-state"
    prefix = "mvp-shared"
  }
}

# provider google including beta features
provider "google" {
  region = "europe-west3"
}

provider "google-beta" {
  region = "europe-west3"
}
