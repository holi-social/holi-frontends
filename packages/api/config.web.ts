/*
TODO try out using the publicRuntimeConfig 
https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
In order to avoid https://nextjs.org/docs/advanced-features/automatic-static-optimization , we would need to use `getInitialProps` for all pages AFAICS
*/
export const holiApiUrl = (() => {
  // client
  if (!(typeof window === 'undefined')) {
    if (window.location.host.indexOf('production.') === 0) {
      console.info('holiApiUrl() => production')
      return 'https://production.unified.apis.project-holi.org/graphql'
    } else {
      console.info('holiApiUrl() => staging')
      // return 'https://staging.unified.apis.project-holi.org/graphql'
      return 'http://localhost:4455/graphql'
    }
  } else if (process.env.HOLI_API_URL) {
    console.info('holiApiUrl() => env ', process.env.HOLI_API_URL)
    // server case
    return process.env.HOLI_API_URL
  }
  // default fallback
  console.info('holiApiUrl() => default ', process.env.HOLI_API_URL)
  return process.env.HOLI_API_URL || 'http://localhost:4455/graphql'
})()
