import type { ISyncStateData, SyncState } from 'matrix-js-sdk/lib/sync'
import React, { useEffect } from 'react'
import { View } from 'react-native'

import useMxLogin from '@holi/chat/src/useMxLogin'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useLinking from '@holi/core/navigation/hooks/useLinking'
import { hasQueryParam } from '@holi/core/navigation/utils/params'
import HoliText from '@holi/ui/components/atoms/HoliText'

export const MatrixChat = () => {
  const { displayError } = useErrorHandling()
  const { getMxLoginClient, accessToken, deviceName } = useMxLogin()
  const { parsedUrl } = useLinking()

  // TODO: remove cast include type assertion
  const hasParams = hasQueryParam(parsedUrl.queryParams, 'loginToken')
  const paramAccessToken = parsedUrl.queryParams?.loginToken

  useEffect(() => {
    // TODO: introduce logic to handled loggedin users
    if (!hasParams) return

    const handleMxClient = async () => {
      const client = getMxLoginClient()
      await client.login('m.login.token', {
        token: paramAccessToken,
        initial_device_display_name: deviceName,
      })

      await client.startClient()

      client.once('sync', (state: SyncState, prevState: SyncState | null, res: ISyncStateData) => {
        // TODO: create persitent client with login result
        // TODO: logout user on logout
        // eslint-disable-next-line no-console
        console.log({ state, prevState, res }, 'state ------') // state will be 'PREPARED' when the client is ready to use
      })
    }

    handleMxClient().catch((err) => displayError(err))

    // TODO: stop client when we unmount
  }, [accessToken, deviceName, displayError, getMxLoginClient, hasParams, parsedUrl?.queryParams, paramAccessToken])

  return (
    <View>
      <HoliText>Matrix Chat</HoliText>
    </View>
  )
}
