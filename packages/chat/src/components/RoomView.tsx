import React from 'react'

import { useRoomState } from '@holi/chat/src/room/store'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const RoomView = () => {
  const state = useRoomState()

  const acceptRoomInvitation = () => {
    return null
  }

  return (
    <>
      <HoliText>Matrix Room</HoliText>
      {state.hasPendingInvitation && (
        <HoliButton label={'accept Invitation'} onPress={acceptRoomInvitation}>
          Accept Invitation
        </HoliButton>
      )}
    </>
  )
}

export default RoomView
