import React, { useEffect } from 'react'
import { Platform, View } from 'react-native'

import mxClient from '@holi/chat/src/ChatClient'
import useChatLogin from '@holi/chat/src/useChatLogin'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isStringOrUndefined } from '@holi/core/helpers'
import useLinking from '@holi/core/navigation/hooks/useLinking'
import HoliText from '@holi/ui/components/atoms/HoliText'

const isWeb = Platform.OS === 'web'

export const Chat = () => {
  const { displayError } = useErrorHandling()
  const { login, restoreSession } = useChatLogin()
  const { parsedUrl } = useLinking()

  const paramAccessToken = parsedUrl.queryParams?.loginToken

  // TODO: Move this use effect in the Reducer Context Provider
  useEffect(() => {
    const initMxClient = async () => {
      // We log in the user if we encounter an access token in the query params.
      // The use linking hook handles navigation and linking depending on the
      // platform. It uses the same API as the expo-linking package. In this
      // case, we are only interested if the paramAccessToken value is a string
      // or undefined. The query param has the QueryParams | null type from the
      // expo-linking package.
      const paramToken = isStringOrUndefined(paramAccessToken) ? paramAccessToken : ''
      const isLoggedIn = await login(paramToken)

      if (isLoggedIn) {
        if (isWeb) {
          // Remove the access token from the Search Query Params
          window.history.replaceState({}, document.title, '/chat')
        }
      }

      // TODO: client singleton is part of the provider value

      const client = await restoreSession(mxClient)
      await client.start()
    }

    initMxClient().catch((err) => {
      // TODO: in case of a soft logout we would need to fetch a new token and do log again
      displayError(err)
    })

    // This `useEffect` should only be called on mount (once) and should not have any dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View>
      <HoliText>Matrix Chat</HoliText>
    </View>
  )
}
