import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'

import useMatrixLogin from '@holi/chat/src/useMatrixLogin'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isStringOrUndefined } from '@holi/core/helpers'
import useLinking from '@holi/core/navigation/hooks/useLinking'
import HoliText from '@holi/ui/components/atoms/HoliText'

const isWeb = Platform.OS === 'web'

export const MatrixChat = () => {
  const { displayError } = useErrorHandling()
  const { login } = useMatrixLogin()
  const { parsedUrl } = useLinking()

  const paramAccessToken = parsedUrl.queryParams?.loginToken

  useEffect(() => {
    const handleMxClient = async () => {
      const paramToken = isStringOrUndefined(paramAccessToken) ? paramAccessToken : ''
      const isLoggedIn = await login(paramToken)

      if (isLoggedIn) {
        if (isWeb) {
          window.history.replaceState({}, document.title, '/chat')
        }
      }

      // TODO: LoadSession
    }

    handleMxClient().catch((err) => {
      // TODO: in case of a soft logout we would need to fetch a new token and do log again
      displayError(err)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View>
      <HoliText>Matrix Chat</HoliText>
    </View>
  )
}
