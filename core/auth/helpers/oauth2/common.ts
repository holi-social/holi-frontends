import type { IncomingHttpHeaders } from 'http'

export const cookieNameForceLogout = 'force_oauth2_logout'
export const mobileWebviewHeader = 'x-mobile-webview'

export interface OAuth2DefaultProps {
  isInWebview?: boolean
}

export const createDefaultProps = (headers: IncomingHttpHeaders): OAuth2DefaultProps => {
  return {
    isInWebview: headers[mobileWebviewHeader] === 'true',
  }
}
