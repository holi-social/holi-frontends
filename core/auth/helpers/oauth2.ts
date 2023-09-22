import type { IncomingHttpHeaders } from 'http'

export const mobileWebviewHeader = 'x-mobile-webview'

export interface OAuth2DefaultProps {
  isInWebview?: boolean
}

export const createDefaultProps = (headers: IncomingHttpHeaders): OAuth2DefaultProps => {
  return {
    isInWebview: headers[mobileWebviewHeader] === 'true',
  }
}
