import { environmentId } from '@holi/web/environment'

export const owncloudUrl = (() => {
  const environment = environmentId === 'production' ? environmentId : 'development'
  return process.env.NEXT_PUBLIC_OWNCLOUD_BASE_URL || `https://${environment}.cloud.project-holi.org`
})()
