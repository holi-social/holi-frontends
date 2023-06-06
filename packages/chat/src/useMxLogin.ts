import AsyncStore from '@react-native-async-storage/async-storage'
import type { IMatrixClientCreateOpts, MatrixClient } from 'matrix-js-sdk'
import { useCallback, useEffect, useRef } from 'react'

import MatrixLogin, { SSOAction } from '@holi/chat/src/MatrixLogin'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useLinking from '@holi/core/navigation/hooks/useLinking'

export interface UseMXLogin {
  handleSSORedirect: () => Promise<void>
  getMxLoginClient: (options?: IMatrixClientCreateOpts) => MatrixClient
  accessToken: string | null
  deviceName: string
}

const useMxLogin = (): UseMXLogin => {
  const accessToken = useRef<string | null>(null)

  const { createUrl, openUrl } = useLinking()
  const { displayError } = useErrorHandling()
  const callbackUrl = createUrl('/chat')

  const matrixLogin = new MatrixLogin(callbackUrl)
  const redirectURL = matrixLogin.getRedirectURL(SSOAction.LOGIN)
  const getMxLoginClient = matrixLogin.getTemporaryClient()
  const homeserverKey = matrixLogin.homeserverKey

  const handleSSORedirect = useCallback(async () => {
    if (redirectURL === null) {
      displayError('Unable to retrieve chat server redirect URL')
      return
    }

    await openUrl(redirectURL)
  }, [displayError, openUrl, redirectURL])

  useEffect(() => {
    AsyncStore.getItem(homeserverKey).then((token) => {
      accessToken.current = token
    })
  }, [homeserverKey])

  return {
    handleSSORedirect,
    getMxLoginClient,
    accessToken: accessToken.current,
    deviceName: matrixLogin.deviceName,
  }
}

export default useMxLogin
