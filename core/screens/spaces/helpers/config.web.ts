import { environmentId } from '@holi/web/environment'

export const owncloudUrl = (() => {
  const environment = environmentId === 'production' ? environmentId : 'development'
  return process.env.NEXT_PUBLIC_OWNCLOUD_BASE_URL || `https://${environment}.cloud.holi.social`
})()

export const jitsiUrl = (() => {
  return environmentId === 'production' ? 'https://meet.holi.social' : 'https://development.meet.holi.social'
})()
