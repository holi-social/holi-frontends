import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useRef } from 'react'

import MatrixLogin, { SSOAction } from '@holi/chat/src/MatrixLogin'
import { logError } from '@holi/core/errors/helpers'
import useLinking from '@holi/core/navigation/hooks/useLinking'

export interface UseMatrixLogin {
  deviceName: string
  tokenKey: string
  token: string | null
  handleSSORedirect: () => Promise<boolean>
  login: (token: string) => Promise<void>
  getLoginStatus: () => Promise<boolean>
}

const useMatrixLogin = (): UseMatrixLogin => {
  const token = useRef<string | null>(null)

  const { createUrl, openUrl } = useLinking()
  const callbackUrl = createUrl('/chat')

  const matrixLogin = new MatrixLogin(callbackUrl)
  const redirectURL = matrixLogin.getRedirectURL(SSOAction.LOGIN)

  const handleSSORedirect = useCallback(async () => {
    if (redirectURL === null) {
      logError('Unable to retrieve chat server redirect URL')
      return false
    }

    return await openUrl(redirectURL)
  }, [openUrl, redirectURL])

  // TODO: this should be handled by the MatrixLogin
  useEffect(() => {
    if (token.current) return

    AsyncStore.getItem(matrixLogin.homeserverTokenKey)
      .then((t) => {
        token.current = t
      })
      .catch((err) => logError(err))
  }, [matrixLogin.homeserverTokenKey])

  return {
    handleSSORedirect,
    login: matrixLogin.login,
    deviceName: matrixLogin.deviceName,
    token: token.current,
    tokenKey: matrixLogin.homeserverTokenKey,
    getLoginStatus: matrixLogin.getLoginStatus,
  }
}

export default useMatrixLogin
