/*
TODO try out using the publicRuntimeConfig 
https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
In order to avoid https://nextjs.org/docs/advanced-features/automatic-static-optimization , we would need to use `getInitialProps` for all pages AFAICS
*/
export const holiApiUrl = (() => {
  // client
  if (!(typeof window === 'undefined')) {
    if (window.location.host.indexOf('production.') === 0) {
      return 'https://production.unified.apis.project-holi.org/graphql'
    } else {
      return 'https://staging.unified.apis.project-holi.org/graphql'
    }
  } else if (process.env.HOLI_API_URL) {
    // server case
    return process.env.HOLI_API_URL
  }
  // default fallback
  return 'http://localhost:4001/graphql'
})()
