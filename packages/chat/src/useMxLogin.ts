import Constants from 'expo-constants'
import { Platform } from 'react-native'

import Login from '@holi/chat/src/Login'
import useCurrentUrl from '@holi/core/navigation/hooks/useCurrentUrl'

const isWeb = Platform.OS === 'web'
const HOMESERVER_URL = isWeb ? process.env.NEXT_PUBLIC_MX_HS_URL ?? '' : Constants.manifest?.extra?.chat.homeserverUrl

export interface UseMXLogin {
  redirectURL: string | null
}

const useMxLogin = (): UseMXLogin => {
  const { currentUrl } = useCurrentUrl()
  const callbackUrl = new URL(currentUrl).origin + '/chat'
  const mxLogin = new Login(HOMESERVER_URL, callbackUrl)

  const redirectURL = mxLogin.getRedirectURL()
  mxLogin.clearTemporaryClient()

  return { redirectURL }
}

export default useMxLogin
