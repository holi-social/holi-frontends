import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import ChatClient from '@holi/chat/src/ChatClient'
import * as Room from '@holi/chat/src/room/room'
import { storeAtom } from '@holi/chat/src/store/store'
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
  const [state, dispatch] = useAtom(storeAtom)

  const { displayError } = useErrorHandling()
  const [text, setText] = useState('')

  const acceptRoomInvitation = async () => {
    const roomId = state.room.id
    if (roomId === null || !client) {
      displayError('Can not accept an invitation without a room id')
      return
    }

    const room = await Room.join(client, roomId)
    if (!room) {
      displayError('There was a problem joining the room after accepting invitation')
      return
    }

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
    const id = state.room.id
    if (!id) return
    await Room.sendTextMessage(client, id, text)
  }

  return (
    <HoliBox padding={[50, 20, 0, 20]}>
      <HoliBox padding={[20, 20]}>
        <HoliHeading>Matrix Room</HoliHeading>
      </HoliBox>

      {state.room.messages.map((msg) => {
        return (
          <HoliBox key={msg.id} padding={[20, 20]}>
            <HoliText>{msg.content.body}</HoliText>
          </HoliBox>
        )
      })}

      {state.room.id && (
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

      {state.room.hasPendingInvitation && (
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
