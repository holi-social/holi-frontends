export const environmentId = (() => {
  // client
  if (!(typeof window === 'undefined')) {
    if (window.location.host.indexOf('production.') === 0) {
      return 'production'
    } else if (window.location.host.indexOf('staging.') === 0) {
      return 'staging'
    }
  }
  // server + default case
  return process.env.ENVIRONMENT_ID || process.env.NEXT_PUBLIC_ENVIRONMENT_ID || 'development'
})()
