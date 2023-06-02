import { Platform } from 'react-native'

import Login from '@holi/chat/src/Login'

const isWeb = Platform.OS === 'web'
const HS_URL = isWeb ? process.env.NEXT_PUBLIC_MX_HS_URL ?? '' : ''
const IS_URL = isWeb ? process.env.NEXT_PUBLIC_MX_IS_URL ?? '' : ''

export interface UseMXLogin {
  redirectURL: string | null
}

const mxLogin = new Login(HS_URL, IS_URL)

const useMxLogin = (): UseMXLogin => {
  const redirectURL = mxLogin.getRedirectURL()
  mxLogin.clearTemporaryClient()

  return { redirectURL }
}

export default useMxLogin
