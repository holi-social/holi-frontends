import AsyncStore from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import ChatClient from '@holi/chat/src/ChatClient'
import * as Room from '@holi/chat/src/room/room'
import { useRoomDispatch, useRoomState } from '@holi/chat/src/room/store'
import { CURRENT_ROOM_KEY } from '@holi/chat/src/utils/constants'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'

interface Props {
  client: ChatClient | null
}

const RoomView = ({ client }: Props) => {
  const roomState = useRoomState()
  const dispatch = useRoomDispatch()
  const { displayError } = useErrorHandling()
  const [text, setText] = useState('')

  const acceptRoomInvitation = async () => {
    const roomId = roomState.id
    if (roomId === null || !client) {
      displayError('Can not accept an invitation without a room id')
      return
    }

    const room = await Room.join(client, roomId)
    if (!room) {
      displayError('There was a problem joining the room after accepting invitation')
      return
    }

    await AsyncStore.setItem(CURRENT_ROOM_KEY, roomId)

    dispatch({
      type: 'room/invitation_pending',
      payload: {
        id: roomId,
        hasPendingInvitation: false,
      },
    })

    return null
  }

  const sendMessage = async () => {
    if (!client) return
    // TODO: this should be done by the known ID
    const id = roomState.id
    if (!id) return
    await Room.sendTextMessage(client, id, text)
  }

  return (
    <HoliBox padding={[50, 20, 0, 20]}>
      <HoliBox padding={[20, 20]}>
        <HoliHeading>Matrix Room</HoliHeading>
      </HoliBox>

      {roomState.messages.map((msg, idx) => {
        return (
          <HoliBox key={idx} padding={[20, 20]}>
            <HoliText>{msg.body}</HoliText>
          </HoliBox>
        )
      })}

      {roomState.id && (
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

      {roomState.hasPendingInvitation && (
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
