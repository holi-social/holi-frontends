import httpProxy from 'http-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'

const oryUrl = 'https://mystifying-carver-akajr6v4t8.projects.oryapis.com'

export const config = {
  api: {
    // Enable `externalResolver` option in Next.js
    externalResolver: true,
  },
}

/* This middleware is used to prevent CORS errors when calling the Ory API. Since we are currently not hosting Ory Kratos on our own, we cannot set the CORS header for Ory.
This causes erros when calling the Ory API in the web app. This middleware is a work around by passing the requests through the next server. 
By doing so, we send the requests to localhost and they are forwarded to ory from here.
Since the next server is the endpoint for ory, we do not use the Ory Browser API right now. */
const handleProxyInit = (proxy: httpProxy) => {
  proxy.on('proxyReq', (proxyReq, req) => {
    // The headers are removed here to obfuscate that the requests are coming from an Browser.
    proxyReq.removeHeader('Origin')
    proxyReq.removeHeader('Cookie')
    console.info('[api auth handler] (on-proxyReq)  url:', req.url)
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

export default handler
