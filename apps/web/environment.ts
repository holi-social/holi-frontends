export const environmentId = (() => {
  // client
  if (!(typeof window === 'undefined')) {
    if (window.location.host.indexOf('production.') === 0 || window.location.host === 'app.holi.social') {
      return 'production'
    } else if (window.location.host.indexOf('staging.') === 0) {
      return 'staging'
    }
  }
  // server + default case
  return process.env.ENVIRONMENT_ID || process.env.NEXT_PUBLIC_ENVIRONMENT_ID || 'development'
})()

/** TODO: This is a tiny mock of a feature flag. If you want to enable SSR,
 * set this flag to true, and it should be disabled for production until we have
 * a solution for translations. */
export const featureFlag = {
  enableSSR: false && process.env.ENVIRONMENT_ID !== 'production',
}
