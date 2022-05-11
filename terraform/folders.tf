# shared across platforms
resource "google_folder" "mvp" {
  display_name = "MVP"
  parent       = data.terraform_remote_state.holi_infra_state.outputs.project_holi_folder_name
}

# web platform specific
resource "google_folder" "web" {
  display_name = "web"
  parent       = google_folder.mvp.id
}

output "web_folder_id" {
  value = google_folder.web.id
}
