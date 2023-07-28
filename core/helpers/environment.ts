import Constants from 'expo-constants'

import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

export const environment = (() => {
  const environment = Constants.manifest?.extra?.environment
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
