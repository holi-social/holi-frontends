import httpProxy from 'http-proxy'

const API_URL = process.env.HOLI_API_GATEWAY
const proxy = httpProxy.createProxyServer()

// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = (req, res) => {
  console.debug('API_URL', API_URL)
  proxy.web(req, res, { target: API_URL, autoRewrite: false, changeOrigin: true })
}

export default handler
