import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'
import { config } from '@holi/mobile/config'

export const environment = (() => {
  const environment = config.environment
  if (environment === EnvironmentId.PRODUCTION) {
    return EnvironmentId.PRODUCTION
  } else if (environment === EnvironmentId.STAGING) {
    return EnvironmentId.STAGING
  } else if (environment === EnvironmentId.LOCAL) {
    return EnvironmentId.LOCAL
  } else {
    return EnvironmentId.DEVELOPMENT
  }
})()

export const isProduction = environment === EnvironmentId.PRODUCTION
