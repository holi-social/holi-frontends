import { setCookie } from 'cookies-next'

import { cookieNameForceLogout } from '@holi/web/oauth2'

export const ensureOauth2Logout = () => {
  // Set cookie to prevent automatic relogin during oauth2 flow
  setCookie(cookieNameForceLogout, 'true')
}
