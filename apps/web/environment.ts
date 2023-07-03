export enum EnvionmentId {
  PRODUCTION = 'production',
  STAGING = 'staging',
  DEVELOPMENT = 'development',
}

export const environmentId: EnvionmentId = (() => {
  // client
  if (!(typeof window === 'undefined')) {
    if (window.location.host.indexOf('production.') === 0 || window.location.host === 'app.holi.social') {
      return EnvionmentId.PRODUCTION
    } else if (window.location.host.indexOf('staging.') === 0) {
      return EnvionmentId.STAGING
    }
  }
  // server + default case
  const serverEnvironment = process.env.ENVIRONMENT_ID || process.env.NEXT_PUBLIC_ENVIRONMENT_ID || process.env.NODE_ENV
  if (serverEnvironment in Object.values(EnvionmentId)) {
    return serverEnvironment as EnvionmentId
  }

  return EnvionmentId.DEVELOPMENT
})()

/** TODO: This is a tiny mock of a feature flag. If you want to enable SSR,
 * set this flag to true, and it should be disabled for production until we have
 * a solution for translations. */
export const featureFlag = {
  enableSSR: false && process.env.ENVIRONMENT_ID !== 'production',
}
