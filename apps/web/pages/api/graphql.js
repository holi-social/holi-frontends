import httpProxy from 'http-proxy'

const API_URL = process.env.HOLI_API_URL
const proxy = httpProxy.createProxyServer()

// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = (req, res) => {
  req.url = req.url.replace(/^\/api\/graphql/, '')
  // TODO remove after 01.07.2024
  // we changed our domain to app.holi.social. This code deletes any old cookies, that may still reside on unsers browsers,
  // because those old cookies may cause problems in certain rare situations.
  Object.keys(req.cookies).forEach((key) => {
    if (key === 'ory_session_mystifyingcarverakajr6v4t8' || key === 'ory_session_flamboyanthopperh35qftghn9') {
      res.setHeader('Set-Cookie', `${key}=deleted; path=/; domain=holi.social; expires=Thu, 01 Jan 1970 00:00:00 GMT`)
    }
  })
  proxy.web(req, res, { target: API_URL, autoRewrite: false, changeOrigin: true })
}

export default handler
