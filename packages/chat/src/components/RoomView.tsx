import { PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'

import {
  joinRoomAtom,
  roomMessagesAtom,
  roomMessagesSubscriberAtom,
  selectRoomAtom,
  selectedRoomAtomCreator,
} from '@holi/chat/src/store/store'
import { ChatRoom } from '@holi/chat/src/store/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliRichTextInput from '@holi/ui/components/organisms/HoliRichTextInput'

interface Props {
  roomAtom: PrimitiveAtom<ChatRoom>
}

const RoomView = ({ roomAtom }: Props) => {
  const room = useAtomValue(roomAtom)
  const messages = useAtomValue(roomMessagesAtom)
  const [, sendMessage] = useAtom(roomMessagesSubscriberAtom)

  const joinRoom = useSetAtom(joinRoomAtom)
  const selectRoom = useSetAtom(selectRoomAtom)
  const isSelectedRoom = useAtomValue(useMemo(() => selectedRoomAtomCreator(roomAtom), [roomAtom]))

  const [text, setText] = useState('')

  return (
    <HoliBox padding={[50, 20, 0, 20]}>
      <HoliBox padding={[20, 20]}>
        <HoliHeading>{room.name}</HoliHeading>
      </HoliBox>
      <HoliBox padding={[0, 20]}>
        <HoliButton type="secondary" label={'Create a room'} onPress={() => selectRoom(roomAtom)}>
          Select Room
        </HoliButton>
      </HoliBox>

      {isSelectedRoom &&
        messages.map((msg, idx) => {
          return (
            <HoliBox key={idx + 'msg' + msg.timestamp} padding={[20, 20]}>
              <HoliText>{msg.content.body}</HoliText>
            </HoliBox>
          )
        })}

      {isSelectedRoom && room.id && (
        <>
          <HoliBox padding={[20, 20]}>
            <HoliRichTextInput
              style={styles.textInput}
              placeholder={'chat message'}
              autofocus={true}
              onChange={setText}
            />
          </HoliBox>
          <HoliButton label={'send message'} onPress={() => sendMessage({ roomId: room.id, text: text })}>
            Send Message
          </HoliButton>
        </>
      )}

      {isSelectedRoom && room.hasInvitation && (
        <HoliBox padding={[20, 20]}>
          <HoliButton label={'accept Invitation'} onPress={() => joinRoom({ id: room.id, hasInvitation: false })}>
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
