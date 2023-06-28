import { PrimitiveAtom, useAtom } from 'jotai'
import { RoomEvent } from 'matrix-js-sdk'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

import ChatClient from '@holi/chat/src/ChatClient'
import * as Room from '@holi/chat/src/room/room'
import { addMsgToThreadAtom, joinRoomAtom, selectRoomAtom } from '@holi/chat/src/store/store'
import { ChatRoom } from '@holi/chat/src/store/types'
import { logError } from '@holi/core/errors/helpers'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'

interface Props {
  client: ChatClient | null
  roomAtom: PrimitiveAtom<ChatRoom>
}

const RoomView = ({ client, roomAtom }: Props) => {
  const [room] = useAtom(roomAtom)
  const [, select] = useAtom(selectRoomAtom)
  const [, joinRoom] = useAtom(joinRoomAtom)
  const [, addRoom] = useAtom(addMsgToThreadAtom)
  const [text, setText] = useState('')

  // TODO: selection should be done on click when when the user clicks on a room
  useEffect(() => {
    select(roomAtom)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Room Messages Subscriber
   */
  useEffect(() => {
    const registerRoomMessages = async () => {
      if (client === null) return

      const matrixClient = client.get()

      // TODO: remove event listener on unmount
      matrixClient.on(RoomEvent.Timeline, (event) => {
        if (event.getType() !== 'm.room.message') return
        if (room.id !== event.getRoomId()) return

        addRoom(Room.createRoomMessage(room.id, event))
      })
    }
    registerRoomMessages().catch((err) => void logError(err))
    // Its important that we only register to the Room Timeline once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const acceptRoomInvitation = async () => {
    if (room.id === null || !client) {
      logError(new Error('Can not accept an invitation without a room id'))
      return
    }

    const clientRoom = await Room.join(client, room.id)
    if (!clientRoom) {
      logError(new Error('There was a problem joining the room after accepting invitation'))
      return
    }
    joinRoom({ hasInvitation: false })
  }

  const sendMessage = async () => {
    if (!client) return
    // TODO: this should be done by the known ID
    const id = room.id
    if (!id) return
    await Room.sendTextMessage(client, id, text)
  }

  return (
    <HoliBox padding={[50, 20, 0, 20]}>
      <HoliBox padding={[20, 20]}>
        <HoliHeading>Matrix Room</HoliHeading>
      </HoliBox>

      {room.threads.map((msg, idx) => {
        return (
          <HoliBox key={idx + 'msg' + msg.ts} padding={[20, 20]}>
            <HoliText>{msg.content.body}</HoliText>
          </HoliBox>
        )
      })}

      {room.id && (
        <>
          <HoliBox padding={[20, 20]}>
            <HoliRichTextInput
              style={styles.textInput}
              placeholder={'chat message'}
              autofocus={true}
              onChange={setText}
            />
          </HoliBox>
          <HoliButton label={'send message'} onPress={sendMessage}>
            Send Message
          </HoliButton>
        </>
      )}

      {room.hasInvitation && (
        <HoliBox padding={[20, 20]}>
          <HoliButton label={'accept Invitation'} onPress={acceptRoomInvitation}>
            Accept Invitation
          </HoliButton>
        </HoliBox>
      )}
    </HoliBox>
  )
}

export default RoomView

const styles = StyleSheet.create({
  textInput: {
    borderColor: 'grey',
    borderWidth: 2,
  },
})
