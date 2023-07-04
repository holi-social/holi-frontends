import { useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'

import ChatClient from '@holi/chat/src/client/ChatClient'
import useChatLogin from '@holi/chat/src/client/useChatLogin'
import RoomView from '@holi/chat/src/components/RoomView'
import { addRoomAtom, roomAtomsAtom } from '@holi/chat/src/store'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const ChatView = () => {
  const [chatClient, setChatClient] = useState<ChatClient | null>(null)
  const { chatLoginClient } = useChatLogin()

  const roomsAtoms = useAtomValue(roomAtomsAtom)
  const addRoom = useSetAtom(addRoomAtom)

  const { displayError } = useErrorHandling()

  // TODO: Check if the user is logged in

  /**
   * Login and initialize `ChatClient` with a `temporaryLoginClient`
   */
  useEffect(() => {
    const initMatrixClient = async () => {
      const sessionCredentials = await chatLoginClient.getSessionCredentials()
      const client = new ChatClient(sessionCredentials)
      setChatClient(client)

      await client.start()
    }

    initMatrixClient().catch((err) => {
      chatLoginClient.retryLogin().then((sessionCredentials) => {
        const client = new ChatClient(sessionCredentials)
        setChatClient(client)
      })
      displayError(err)
    })
    // This `useEffect` should only be called on mount (once) and should not have any dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /** Add chat rooms joined by the logged in member */
  useEffect(() => {
    const addJoinedRooms = async () => {
      if (!chatClient) return

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
  }, [addRoom, chatClient, displayError, roomsAtoms])

  /** Subscribe to room invitations */
  useEffect(() => {
    let unsubscribe: null | (() => void) = null
    const registerRoomInvitations = async () => {
      if (!chatClient) return

      unsubscribe = await chatClient.subscribeToInvitations((roomId, hasInvitation) => {
        // TODO: get the latest threads if available.
        addRoom({ id: roomId, threads: [], hasInvitation })
      })
    }

    registerRoomInvitations().catch((err) => void displayError(err))

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [roomsAtoms, addRoom, chatClient, displayError])

  // TODO: this room creation function is used when we click one or n users to chat with
  // and write the first messages in the timeline
  const handleRoomCreation = async () => {
    if (!chatClient) {
      logError(new Error('Can not create a room without a client'))
      return
    }
    const testUserIds: string[] = []

    // TODO: We need to add the room to the state here too
    const roomIdResponse = await chatClient.createRoom(testUserIds)
    const roomId = roomIdResponse?.room_id
    if (!roomId) throw new Error('A Chat Room creation should return a room id')
    addRoom({ id: roomId, threads: [], hasInvitation: false })
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
      {roomsAtoms.map((roomAtom) => (
        <RoomView roomAtom={roomAtom} key={`${roomAtom}`} client={chatClient} />
      ))}
    </>
  )
}

export default ChatView
