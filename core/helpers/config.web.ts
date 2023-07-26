import { environment } from '@holi/core/helpers/environment'
import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

export const owncloudUrl = (() => {
  const envBasedUrl =
    environment === EnvironmentId.PRODUCTION
      ? 'https://production.cloud.holi.social'
      : 'https://development.cloud.holi.social'
  return process.env.NEXT_PUBLIC_OWNCLOUD_BASE_URL || envBasedUrl
})()

export const jitsiUrl = (() => {
  return environment === EnvironmentId.PRODUCTION ? 'https://meet.holi.social' : 'https://development.meet.holi.social'
})()
