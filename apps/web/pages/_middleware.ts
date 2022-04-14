/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
// import type { NextApiRequest, NextApiResponse } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  // return new Response('Hello, world!', req)
  console.log('[Next middleware] url:', req.nextUrl.href)
  return NextResponse.next()
  // Only rewrite requests to `/`, as _middleware on the `/pages` root will be executed in every request of the app.
  // if (url.pathname === '/') {
  //   // Parse the cookie
  //   const isInBeta = JSON.parse(req.cookies['beta'] || 'false')

  //   // Rewrite to the correct page
  //   url.pathname = `/${isInBeta ? 'beta' : 'non-beta'}`
  //   return NextResponse.rewrite(url)
  // }
}


// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const requestedUrl = req.url.replace('/api/auth', '')
//   const rewriteUrl = `${oryUrl}${requestedUrl}`
//   console.info('######### [api handler]  Rewrite to:', rewriteUrl)
//   request({
//     url: rewriteUrl,
//     // headers: {
//     //   Authorization: auth,
//     // },
//   })
//     .on('response', function (response) {
//       console.info('######### [api handler]  Status code:', response.statusCode) // 200
//       console.info('######### [api handler]  Response header:', response.headers['content-type']) // 'image/png'
//     })
//     .on('error', function (error) {
//       console.info('######### [api handler] Error:', error)
//     })
//     .pipe(res)
// }
