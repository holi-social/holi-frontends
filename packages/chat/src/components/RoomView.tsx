import { PrimitiveAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'

import ChatClient from '@holi/chat/src/client/ChatClient'
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
  const room = useAtomValue(roomAtom)
  const selectRoom = useSetAtom(selectRoomAtom)
  const joinRoom = useSetAtom(joinRoomAtom)
  const addMessage = useSetAtom(addMsgToThreadAtom)
  const [text, setText] = useState('')

  // TODO: selection should be done on click when when the user clicks on a room
  useEffect(() => {
    selectRoom(roomAtom)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Room Messages Subscriber
   */
  useEffect(() => {
    let unsubscribe: null | (() => void) = null
    const registerRoomMessages = async () => {
      if (!client) {
        logError(new Error('Can not register messages without a client'))
        return
      }

      unsubscribe = await client.subscribeToMessages(room.id, (msg) => {
        addMessage(msg)
      })
    }
    registerRoomMessages().catch((err) => void logError(err))

    return () => {
      if (unsubscribe) unsubscribe()
    }
    // Its important that we only register to the Room Timeline once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const acceptRoomInvitation = async () => {
    if (!client) {
      logError(new Error('Can not accept an invitation without a client'))
      return
    }

    const hasJoined = await client.joinRoom(room.id)
    if (!hasJoined) return

    joinRoom({ hasInvitation: false })
  }

  const sendMessage = async () => {
    if (!client) {
      logError(new Error('Can not send a text message without a client'))
      return
    }

    await client.sendTextMessage(room.id, text)
  }

  return (
    <HoliBox padding={[50, 20, 0, 20]}>
      <HoliBox padding={[20, 20]}>
        <HoliHeading>Matrix Room</HoliHeading>
      </HoliBox>

      {room.threads.map((msg, idx) => {
        return (
          <HoliBox key={idx + 'msg' + msg.timestamp} padding={[20, 20]}>
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
