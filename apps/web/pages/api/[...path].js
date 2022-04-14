import express from 'express'
import request from 'request'
import Cors from 'cors'
// import type { NextApiRequest, NextApiResponse } from 'next/server'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST'],
})

const oryUrl = 'https://mystifying-carver-akajr6v4t8.projects.oryapis.com'


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {

      const requestedUrl = req.url.replace('/api/auth', '')

      console.log('###### requestedUrl:', requestedUrl)
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

async function handler(req, res) {
  // Run the middleware
  // await runMiddleware(req, res, cors)

  // Rest of the API logic
  // res.json({ message: 'Hello Everyone!' })

  const requestedUrl = req.url.replace('/api/auth', '')
  request({
    url: `${oryUrl}${requestedUrl}`,
    // headers: {
    //   Authorization: auth,
    // },
  })
    .on('response', function (response) {
      console.info('donwload response', response.statusCode) // 200
      console.info('download response', response.headers['content-type']) // 'image/png'
    })
    .on('error', function (error) {
      console.info('download error', error)
    })
    .pipe(res)
}

export default handler


// const handleProxyInit = (proxy: httpProxy) => {
//   /**
//    * Check the list of bindable events in the `http-proxy` specification.
//    * @see https://www.npmjs.com/package/http-proxy#listening-for-proxy-events
//    */
//   proxy.on('proxyReq', (proxyReq, req, res) => {
//     ...
//   });
//   proxy.on('proxyRes', (proxyRes, req, res) => {
//     ...
//   });
// }

// export default async (req: NextApiRequest, res: NextApiResponse)
//   => httpProxyMiddleware(req, res, {
//     ...
//     target: 'http://example.com',
//     onProxyInit: handleProxyInit,
//   }
// )
