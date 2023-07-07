import { useAtom, useAtomValue } from 'jotai'
import React, { useEffect, useRef } from 'react'

import RoomView from '@holi/chat/src/components/RoomView'
import {
  addToRoomAtoms,
  roomAtomsAtom,
  roomAtomsAtomSubscriber,
  roomMessagesAtom,
  roomMessagesSubscriberAtom,
} from '@holi/chat/src/store'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const ChatView = () => {
  useAtom(roomMessagesAtom)
  useAtom(roomAtomsAtomSubscriber)
  useAtom(roomMessagesSubscriberAtom)

  const commitRef = useRef(0)
  const roomsAtoms = useAtomValue(roomAtomsAtom)

  const [, createRoomAtom] = useAtom(addToRoomAtoms)

  useEffect(() => {
    commitRef.current += 1
  })

  // TODO: this room creation function is used when we click one or n users to chat with
  // and write the first messages in the timeline
  const handleRoomCreation = async () => {
    // TODO: Get Matrix user ids dynamically
    const userIds: string[] = ['@sonja_palma:local.chat.holi.social']
    createRoomAtom(userIds)
  }

  return (
    <>
      <HoliBox padding={[20, 20]}>
        <HoliHeading level="1">Matrix Chat</HoliHeading>
      </HoliBox>
      <HoliBox padding={[20, 20]}>
        <HoliHeading level="2">React Commits: {commitRef.current}</HoliHeading>
      </HoliBox>
      <HoliBox padding={[20, 20]}>
        <HoliButton label={'Create a room'} onPress={handleRoomCreation}>
          Create a room
        </HoliButton>
      </HoliBox>
      {roomsAtoms.map((roomAtom) => {
        return <RoomView roomAtom={roomAtom} key={`${roomAtom}`} />
      })}
    </>
  )
}

export default ChatView
