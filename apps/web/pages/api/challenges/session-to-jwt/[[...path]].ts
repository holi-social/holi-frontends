import httpProxy from 'http-proxy'
import type { NextApiRequest, NextApiResponse } from 'next'

const proxy = httpProxy.createProxyServer()

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  proxy.web(req, res, { target: process.env.HOLI_API_GATEWAY, autoRewrite: false, changeOrigin: true })
}

export default handler
