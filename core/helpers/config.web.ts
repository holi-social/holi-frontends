import { environment } from '@holi/core/helpers/environment'
import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

export const owncloudUrl = (() => {
  const env = environment === EnvironmentId.PRODUCTION ? environment : 'development'
  return process.env.NEXT_PUBLIC_OWNCLOUD_BASE_URL || `https://${env}.cloud.holi.social`
})()

export const jitsiUrl = (() => {
  return environment === EnvironmentId.PRODUCTION ? 'https://meet.holi.social' : 'https://development.meet.holi.social'
})()
