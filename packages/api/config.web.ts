export const holiApiUrl = (() => {
  console.info('determining URL')
  if (!(typeof window === 'undefined')) {
    if (window.location.host.indexOf('production.') === 0) {
      console.info('production')
      return 'https://production.unified.apis.project-holi.org/graphql'
    } else {
      console.info('staging')
      return 'https://staging.unified.apis.project-holi.org/graphql'
    }
  } else if (process.env.HOLI_API_URL) {
    // server case
    console.info('server')
    return process.env.HOLI_API_URL
  }
  // default fallback
  console.info('default')
  return 'http://localhost:4001/graphql'
})()
