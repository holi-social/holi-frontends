export const holiApiUrl = (() => {
  if (!(typeof window === 'undefined')) {
    if (window.location.host.indexOf('production.') === 0) {
      return 'https://production.unified.apis.project-holi.org'
    } else {
      return 'https://staging.unified.apis.project-holi.org'
    }
  } else if (process.env.HOLI_API_URL) {
    // server case
    return process.env.HOLI_API_URL
  }
  // default fallback
  return 'http://localhost:4001/graphql'
})()
