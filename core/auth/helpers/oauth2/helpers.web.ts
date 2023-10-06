import { deleteCookie } from 'cookies-next'

import { cookieNameForceLogout } from '@holi/core/auth/helpers/oauth2/common'

export const confirmOAuth2Login = () => {
  deleteCookie(cookieNameForceLogout)
}
