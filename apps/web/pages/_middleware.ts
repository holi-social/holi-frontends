import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const middleware = (request: NextRequest) => {
  // only option on google cloud run to get the hostname of the request
  const host = request.headers.get('host')

  // only enable basic auth on staging
  if (host && host.startsWith('deactivatedstaging')) {
    // verify auth credentials
    const authInfo = request.headers?.get('Authorization')
    if (!authInfo) {
      return new NextResponse(JSON.stringify({ success: false, message: 'authentication needed' }), {
        status: 401,
        headers: { 'content-type': 'application/json', 'WWW-Authenticate': 'Basic realm=Staging-System' },
      })
    }
    const base64Credentials = authInfo.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')
    // password is the acronym of "You ain't gonna need it!"
    if (username !== 'd3vs0nly' || password !== 'Yagni!') {
      return new NextResponse(JSON.stringify({ success: false, message: 'authentication failed' }), {
        status: 401,
        headers: { 'content-type': 'application/json', 'WWW-Authenticate': 'Basic realm=Staging-System' },
      })
    }
  }
  return NextResponse.next()
}
