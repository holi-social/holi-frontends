# shared across platforms
resource "google_folder" "mvp" {
  display_name = "MVP"
  parent       = data.terraform_remote_state.holi_infra_state.outputs.project_holi_folder_name
}
