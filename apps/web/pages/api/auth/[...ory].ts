import { NextApiRequest, NextApiResponse } from 'next'
import httpProxy from 'http-proxy'
import httpProxyMiddleware from 'next-http-proxy-middleware'

const oryUrl = 'https://mystifying-carver-akajr6v4t8.projects.oryapis.com'

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
  },
}

// =========== Option 1 ===========
// Returns error: "The HTTP Request Header included the \"Origin\" key, indicating that this request was made as part of an AJAX request in a Browser. The flow however was initiated as an API request. To prevent potential misuse and mitigate several attack vectors including CSRF, the request has been blocked. Please consult the documentation."
const handleProxyInit = (proxy: httpProxy) => {
  /**
   * Check the list of bindable events in the `http-proxy` specification.
   * @see https://www.npmjs.com/package/http-proxy#listening-for-proxy-events
   */
  proxy.on('proxyReq', (proxyReq, req) => {
    // proxyReq.setHeader('Origin', oryUrl)
    proxyReq.removeHeader('Origin')
    proxyReq.removeHeader('Cookie')
    console.info('######### [api handler] (on-proxyReq)  url:', req.url)
    // console.info('######### [api handler] (on-proxyReq)  req:', req.headers)
    console.info('######### [api handler] (on-proxyReq)  proxyReq:', proxyReq.getHeaders())
  })
  // proxy.on('proxyRes', (proxyRes, req, response) => {
  //   console.info('######### [api handler] (on-proxyRes)  statusCode:', proxyRes.statusCode)
  //   console.info('######### [api handler] (on-proxyRes)  proxyResponse:', proxyRes.headers)
  //   response.setHeader('statusCode', 200)
  //   // console.info('######### [api handler] (on-proxyRes)  response:', response.getHeaders())
  // })
}
const handler = async (req: NextApiRequest, res: NextApiResponse) =>
  httpProxyMiddleware(req, res, {
    target: oryUrl,
    pathRewrite: [
      {
        patternStr: '^/api/auth',
        replaceStr: '',
      },
    ],
    onProxyInit: handleProxyInit,
  })

export default handler
