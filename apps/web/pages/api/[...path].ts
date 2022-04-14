import { NextApiRequest, NextApiResponse } from 'next'
import httpProxy, { ServerOptions, ProxyReqCallback } from 'http-proxy'
import httpProxyMiddleware from 'next-http-proxy-middleware'
import express from 'express'
import request from 'request'

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
  proxy.on('proxyRes', (proxyRes, req, response) => {
    console.info('######### [api handler] (on-proxyRes)  statusCode:', proxyRes.statusCode)
    console.info('######### [api handler] (on-proxyRes)  proxyResponse:', proxyRes.headers)
    response.setHeader('statusCode', 200)
    // console.info('######### [api handler] (on-proxyRes)  response:', response.getHeaders())
  })
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


// =========== Option 2 ===========
// Returns error "Could not find a strategy to sign you up with. Did you fill out the form correctly?"

// const app = express()
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const requestedUrl = req.url.replace('/api/auth', '')
//   const rewriteUrl = `${oryUrl}${requestedUrl}`
//   console.info('######### [api handler]  Rewrite to:', rewriteUrl)
//   request({
//     url: rewriteUrl,
//     headers: {
//       // origin: 'https://mystifying-carver-akajr6v4t8.projects.oryapis.com',
//       'content-type': 'application/json',
//       accept: 'application/json, text/plain, */*',
//     },
//   })
//     .on('response', (response) => {
//       console.info('######### [api handler]  Status code:', response.statusCode)
//       console.info('######### [api handler]  Response contentType:', response.headers['content-type'])
//       console.info('######### [api handler]  response.headers:', response.headers)
//     })
//     .on('body', (body) => {
//       console.info('######### [api handler] body:', body)
//     })
//     .on('error', (error) => {
//       console.info('######### [api handler] Error:', error)
//     })
//     .pipe(res)
// }

export default handler
