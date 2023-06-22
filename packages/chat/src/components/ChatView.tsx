import { useAtom } from 'jotai/react'
import { RoomEvent, RoomStateEvent } from 'matrix-js-sdk'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import ChatClient from '@holi/chat/src/ChatClient'
import RoomView from '@holi/chat/src/components/RoomView'
import * as Room from '@holi/chat/src/room/room'
import { storeAtom } from '@holi/chat/src/store/store'
import useChatLogin from '@holi/chat/src/useChatLogin'
import type { Message } from '@holi/chat/src/utils'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isStringOrUndefined } from '@holi/core/helpers'
import useLinking from '@holi/core/navigation/hooks/useLinking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const isWeb = Platform.OS === 'web'

const ChatView = () => {
  const [chatClient, setChatClient] = useState<ChatClient | null>(null)
  const [state, dispatch] = useAtom(storeAtom)

  const { displayError } = useErrorHandling()
  const { login, restoreSessionCredentials } = useChatLogin()
  const { parsedUrl } = useLinking()

  const paramAccessToken = parsedUrl.queryParams?.loginToken

  //TODO: Move all the direct calls of the matrix client behind the Client Chat facade

  /**
   * Login and initialize `ChatClient`
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
      const isLoggedIn = await login(paramToken)

      if (isLoggedIn) {
        if (isWeb) {
          // Remove the access token from the Search Query Params
          window.history.replaceState({}, document.title, '/chat')
        }
      }

      const sessionCredentials = await restoreSessionCredentials()
      const client = new ChatClient(sessionCredentials)
      setChatClient(client)

      await client.start()
    }

    initMatrixClient().catch((err) => {
      // TODO: in case of a soft logout we would need to fetch a new token and do log again
      displayError(err)
    })
    // This `useEffect` should only be called on mount (once) and should not have any dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   *  Register rooms from a member
   */
  useEffect(() => {
    const registerRoomInvitations = async () => {
      if (chatClient === null) return

      const matrixClient = chatClient.get()

      const joinedRoomsResponse = await matrixClient.getJoinedRooms()
      const joinedRoomsIds = joinedRoomsResponse.joined_rooms
      if (joinedRoomsIds.length > 0) {
        dispatch({
          type: 'room/set_rooms_ids',
          payload: { roomsIds: joinedRoomsIds },
        })
      }
    }

    registerRoomInvitations().catch((err) => void displayError(err))
  }, [chatClient, dispatch, displayError, state.room.id])

  /**
   * Room New Member Subscriber
   */
  useEffect(() => {
    const registerRoomInvitations = async () => {
      if (chatClient === null) return

      const matrixClient = chatClient.get()

      // TODO: remove event listener on unmount

      // Pending room invitations subscriber
      matrixClient.on(RoomStateEvent.NewMember, async (event) => {
        const hasInvitation = await Room.hasPendingInvitation(event)
        const roomId = event.getRoomId()
        if (!hasInvitation || !roomId) return

        dispatch({
          type: 'room/invitation_pending',
          payload: {
            hasPendingInvitation: hasInvitation,
            id: roomId,
          },
        })
      })
    }

    registerRoomInvitations().catch((err) => void displayError(err))
  }, [chatClient, dispatch, displayError])

  /**
   * Room Messages Subscriber
   */
  useEffect(() => {
    const registerRoomMessages = async () => {
      if (chatClient === null) return

      const matrixClient = chatClient.get()

      // TODO: remove event listener on unmount
      matrixClient.on(RoomEvent.Timeline, (event) => {
        if (event.getType() !== 'm.room.message') return

        // TODO: should only read messages for the correct room, speak from the store id and not roomids
        if (state.room.id !== event.getRoomId()) return
        const messageId = event.getId()
        const messageIdx = state.room.messages.findIndex((m) => m.id === messageId)
        if (messageIdx >= 0 || !messageId) return

        const message: Message = {
          id: messageId,
          content: event.getContent(),
        }

        dispatch({
          type: 'room/set_message',
          payload: { message },
        })
      })
    }

    registerRoomMessages().catch((err) => void displayError(err))
  }, [chatClient, displayError, dispatch, state.room.id, state.room.messages])

  // TODO: this room creation function is used when we click one or n users to chat with
  // and write the first messages in the timeline
  const handleRoomCreation = async () => {
    if (chatClient === null) return
    const testUserIds: string[] = [
      '@sonja=20palma:local.chat.holi.social',
      '@95316b1a-b714-48cf-a93a-8254d4dc9047:local.chat.holi.social',
    ]

    // TODO: Dispatch room id and update rooms
    // TODO: Dispatch open new room conversation
    const roomIdResponse = await Room.create(chatClient, testUserIds, Room.dmRoomOptions)
    const roomId = roomIdResponse?.room_id

    if (!roomId) throw new Error('A Chat Room creation should return a room id')

    dispatch({
      type: 'room/set_room_id',
      payload: { roomId },
    })
  }

  return (
    <>
      <HoliBox padding={[20, 20]}>
        <HoliHeading level="1">Matrix Chat</HoliHeading>
      </HoliBox>

      {!state.room.id && (
        <HoliBox padding={[20, 20]}>
          <HoliButton label={'Create a room'} onPress={handleRoomCreation}>
            Create a room
          </HoliButton>
        </HoliBox>
      )}
      <RoomView client={chatClient} />
    </>
  )
}

export default ChatView
