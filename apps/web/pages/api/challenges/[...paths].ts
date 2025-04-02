import type { ClientRequest, IncomingMessage } from 'http'
import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

const proxy = httpProxy.createProxyServer()

proxy.on('proxyReq', (proxyReq: ClientRequest, req: IncomingMessage) => {
  // Strip this nextJS handlers path ('api/challenges') from the path
  if (req.url) {
    const path = req.url.replace(/^\/api\/challenges/, '')
    proxyReq.path = path
  }
})

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  proxy.web(req, res, { target: process.env.HOLI_CHALLENGES_APP, autoRewrite: false, changeOrigin: true })
}

export default handler
