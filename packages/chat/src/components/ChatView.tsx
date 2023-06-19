import { RoomStateEvent } from 'matrix-js-sdk'
import React, { useEffect, useMemo } from 'react'
import { Platform } from 'react-native'

import ChatClient from '@holi/chat/src/ChatClient'
import RoomView from '@holi/chat/src/components/RoomView'
import * as Room from '@holi/chat/src/room/room'
import { useRoomDispatch } from '@holi/chat/src/room/store'
import useChatLogin from '@holi/chat/src/useChatLogin'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isStringOrUndefined } from '@holi/core/helpers'
import useLinking from '@holi/core/navigation/hooks/useLinking'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const isWeb = Platform.OS === 'web'

const ChatView = () => {
  const chatClient = useMemo(() => new ChatClient(), [])
  const dispatch = useRoomDispatch()

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

      const client = await restoreSession(chatClient)
      const matrixClient = await client.start()

      matrixClient.on(RoomStateEvent.NewMember, async (event) => {
        const hasInvitation = await Room.hasPendingInvitation(event)
        if (!hasInvitation) return
        dispatch({ type: 'room/invitation_pending', payload: { hasPendingInvitation: hasInvitation } })
      })
    }

    initMxClient().catch((err) => {
      // TODO: in case of a soft logout we would need to fetch a new token and do log again
      displayError(err)
    })

    // This `useEffect` should only be called on mount (once) and should not have any dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TODO: this room creation function is used when we click one or n users to chat with
  const handleRoomCreation = async () => {
    const testUserIds: string[] = []
    const matrixClient = chatClient.get()
    if (!matrixClient) {
      logError(new Error('A Matrix client is necessary for creating a room'))
      return
    }

    // TODO: Dispatch room id and update rooms
    // TODO: Dispatch open new room conversation
    const roomId = await Room.create(matrixClient, testUserIds, Room.dmRoomOptions)

    if (!roomId?.room_id) {
      return
    }
  }

  return (
    <>
      <HoliText>Matrix Chat</HoliText>
      <HoliButton label={'Create a room'} onPress={handleRoomCreation}>
        Create a room
      </HoliButton>
      <RoomView />
    </>
  )
}

export default ChatView
