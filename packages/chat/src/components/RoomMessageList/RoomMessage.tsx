import { useAtomValue } from 'jotai'
import React, { useMemo } from 'react'

import RoomMembershipBadge from '@holi/chat/src/components/RoomMessageList/RoomMembershipBadge'
import RoomTextMessage from '@holi/chat/src/components/RoomMessageList/RoomTextMessage'
import { type ChatMessage, roomMembersAtomCreator } from '@holi/chat/src/store'
import type { User } from '@holi/core/screens/userprofile/types'

interface Props {
  message: ChatMessage
  roomId: string
  holiUser?: User
  showAvatar?: boolean
  isPrevMessageFromSameUser?: boolean
  isNextMessageFromSameUser?: boolean
  roomType: string
  testID?: string
}

const RoomMessage = ({ holiUser, message, roomType, roomId, ...props }: Props) => {
  const membersRecord = useAtomValue(useMemo(() => roomMembersAtomCreator(roomId), [roomId]))
  const member = membersRecord[message.sender ?? '']

  switch (message.type) {
    case 'message':
      return <RoomTextMessage member={member} holiUser={holiUser} message={message} {...props} />
    case 'membership':
      if (roomType === 'private') return
      return <RoomMembershipBadge member={member} user={holiUser} message={message} />
  }
}

export default RoomMessage
