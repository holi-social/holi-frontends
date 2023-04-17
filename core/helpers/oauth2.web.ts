import { deleteCookie } from 'cookies-next'

import { cookieNameForceLogout } from '@holi/web/oauth2'

export const ensureOAuth2Logout = () => {
  // no-op
}

export const confirmOAuth2Login = () => {
  deleteCookie(cookieNameForceLogout)
}
