import httpProxy from 'http-proxy'

import { posthogHost } from '@holi/core/helpers/config'

const proxy = httpProxy.createProxyServer()

// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = (req, res) => {
  req.url = req.url.replace('/api/tracking', '')

  // we don't want to send our cookies to posthog, so we strip them all
  req.headers.cookie = ''

  proxy.web(req, res, { target: posthogHost, autoRewrite: false, changeOrigin: true })
}

export default handler
