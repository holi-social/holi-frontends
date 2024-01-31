import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

export const getEnvironmentId = () => {
  // server + default case
  if (typeof window === 'undefined') {
    const serverEnvironment =
      process.env.ENVIRONMENT_ID || process.env.NEXT_PUBLIC_ENVIRONMENT_ID || process.env.NODE_ENV
    if (serverEnvironment && Object.values<string>(EnvironmentId).includes(serverEnvironment)) {
      return serverEnvironment as EnvironmentId
    }
    // client
  } else {
    // production
    if (window.location?.host.indexOf('production.') === 0 || window.location?.host === 'app.holi.social') {
      return EnvironmentId.PRODUCTION
    }

    // staging
    if (window.location?.host.indexOf('staging.') === 0) {
      return EnvironmentId.STAGING
    }
  }

  return EnvironmentId.DEVELOPMENT
}

export const environmentId: EnvironmentId = getEnvironmentId()

/** TODO: This is a tiny mock of a feature flag. If you want to enable SSR,
 * set the environment variable NEXT_PUBLIC_SSR_ENABLED. It should be disabled
 * for production until we have a solution for translations. */
export const featureFlag = {
  enableSSR: process.env.NEXT_PUBLIC_SSR_ENABLED && process.env.ENVIRONMENT_ID !== 'production',
}
