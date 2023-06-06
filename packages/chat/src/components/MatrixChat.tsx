import React, { useEffect } from 'react'
import { View } from 'react-native'

import useMxLogin from '@holi/chat/src/useMxLogin'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useLinking from '@holi/core/navigation/hooks/useLinking'
import HoliText from '@holi/ui/components/atoms/HoliText'

export const MatrixChat = () => {
  const { displayError } = useErrorHandling()
  const { getMxLoginClient, accessToken, deviceName } = useMxLogin()
  const { parsedUrl } = useLinking()

  // TODO: remove cast include type assertion
  const paramAccessToken = parsedUrl?.queryParams?.loginToken as string

  useEffect(() => {
    if (!paramAccessToken && typeof paramAccessToken !== 'string') return

    const handleMxClient = async () => {
      const client = getMxLoginClient()

      await client.login('m.login.token', {
        token: paramAccessToken,
        initial_device_display_name: deviceName,
      })

      await client.startClient()

      //      client.once('sync', (state, prevState, res) => {
      //        // eslint-disable-next-line no-console
      //        console.log({ state, prevState, res }, 'state') // state will be 'PREPARED' when the client is ready to use
      //      })
    }

    handleMxClient().catch((err) => displayError(err))

    // TODO: stop client when we unmount
  }, [accessToken, deviceName, displayError, getMxLoginClient, parsedUrl?.queryParams, paramAccessToken])

  return (
    <View>
      <HoliText>Matrix Chat</HoliText>
    </View>
  )
}
