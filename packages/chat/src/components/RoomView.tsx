import React from 'react'

import ChatClient from '@holi/chat/src/ChatClient'
import * as Room from '@holi/chat/src/room/room'
import { useRoomDispatch, useRoomState } from '@holi/chat/src/room/store'
import { useErrorHandling } from '@holi/core/errors/hooks'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface Props {
  client: ChatClient
}

const RoomView = ({ client }: Props) => {
  const roomState = useRoomState()
  const dispatch = useRoomDispatch()

  const { displayError } = useErrorHandling()

  const acceptRoomInvitation = async () => {
    const roomId = roomState.id
    if (roomId === null || !client) {
      displayError('Can not accept an invitation without a room id')
      return
    }

    const room = await Room.join(client, roomId)
    if (!room) {
      displayError('There was a problem joining the room')
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

  return (
    <>
      <HoliText>Matrix Room</HoliText>
      {roomState.hasPendingInvitation && (
        <HoliButton label={'accept Invitation'} onPress={acceptRoomInvitation}>
          Accept Invitation
        </HoliButton>
      )}
    </>
  )
}

export default RoomView
