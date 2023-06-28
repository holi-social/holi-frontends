import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import ChatClient from '@holi/chat/src/client/ChatClient'
import useChatLogin from '@holi/chat/src/client/useChatLogin'
import RoomView from '@holi/chat/src/components/RoomView'
import * as Room from '@holi/chat/src/room/room'
import { addRoomAtom, roomAtomsAtom } from '@holi/chat/src/store'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isStringOrUndefined } from '@holi/core/helpers'
import useLinking from '@holi/core/navigation/hooks/useLinking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const isWeb = Platform.OS === 'web'

const ChatView = () => {
  const [chatClient, setChatClient] = useState<ChatClient | null>(null)
  const { temporaryLoginClient } = useChatLogin()

  const [rooms] = useAtom(roomAtomsAtom)
  const [, addRoom] = useAtom(addRoomAtom)

  const { parsedUrl } = useLinking()
  const { displayError } = useErrorHandling()

  const paramAccessToken = parsedUrl.queryParams?.loginToken

  //TODO: Move all the direct calls of the matrix client behind the Client Chat facade

  /**
   * Login and initialize `ChatClient` with a `temporaryLoginClient`
   */
  useEffect(() => {
    const initMatrixClient = async () => {
      // We log in the user if we encounter an access token in the query params.
      // The use linking hook handles navigation and linking depending on the
      // platform. It uses the same API as the expo-linking package. In this
      // case, we are only interested if the paramAccessToken value is a string
      // or undefined. The query param has the QueryParams | null type from the
      // expo-linking package.
      const paramToken = isStringOrUndefined(paramAccessToken) ? paramAccessToken : ''
      const isLoggedIn = await temporaryLoginClient.login(paramToken)

      if (isLoggedIn) {
        if (isWeb) {
          // Remove the access token from the Search Query Params
          window.history.replaceState({}, document.title, '/chat')
        }
      }

      const sessionCredentials = await temporaryLoginClient.restoreSessionCredentials()
      const client = new ChatClient(sessionCredentials)
      setChatClient(client)

      await client.start()
    }

    initMatrixClient().catch((err) => {
      // TODO: in case of a soft logout we would need to fetch a new token and do log again
      displayError(err)
    })
    // This `useEffect` should only be called on mount (once) and should not have any dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Add chat rooms joined by the logged in member */
  useEffect(() => {
    const addJoinedRooms = async () => {
      if (chatClient === null) return

      const rooms = await chatClient.getJoinedRooms()
      rooms.forEach((room) => {
        addRoom({
          id: room.roomId,
          hasInvitation: false,
          threads: chatClient.getRoomMessages(room),
        })
      })
    }

    addJoinedRooms().catch((err) => void displayError(err))
  }, [addRoom, chatClient, displayError, rooms])

  /** Subscribe to room invitations */
  useEffect(() => {
    let unsubscribe: null | (() => void) = null
    const registerRoomInvitations = async () => {
      if (chatClient === null) return

      unsubscribe = await chatClient.subscribeToInvitations((roomId, hasInvitation) => {
        // TODO: get the latest threads if available.
        addRoom({ id: roomId, threads: [], hasInvitation })
      })
    }

    registerRoomInvitations().catch((err) => void displayError(err))

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [rooms, addRoom, chatClient, displayError])

  // TODO: this room creation function is used when we click one or n users to chat with
  // and write the first messages in the timeline
  const handleRoomCreation = async () => {
    if (chatClient === null) return
    const testUserIds: string[] = ['@mau=20palma:local.chat.holi.social']

    const roomIdResponse = await Room.create(chatClient, testUserIds, Room.dmRoomOptions)
    const roomId = roomIdResponse?.room_id
    if (!roomId) throw new Error('A Chat Room creation should return a room id')
  }

  return (
    <>
      <HoliBox padding={[20, 20]}>
        <HoliHeading level="1">Matrix Chat</HoliHeading>
      </HoliBox>

      <HoliBox padding={[20, 20]}>
        <HoliButton label={'Create a room'} onPress={handleRoomCreation}>
          Create a room
        </HoliButton>
      </HoliBox>
      {rooms.map((roomAtom) => (
        <RoomView roomAtom={roomAtom} key={`${roomAtom}`} client={chatClient} />
      ))}
    </>
  )
}

export default ChatView
