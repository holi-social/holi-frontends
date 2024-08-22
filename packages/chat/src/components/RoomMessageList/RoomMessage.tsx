import { useAtomValue } from 'jotai'
import React, { useMemo } from 'react'

import type { ChatRoomMessage } from '@holi/chat/src/client/types'
import RoomMembershipBadge from '@holi/chat/src/components/RoomMessageList/RoomMembershipBadge'
import RoomTextMessage from '@holi/chat/src/components/RoomMessageList/RoomTextMessage'
import { roomMembersAtomCreator } from '@holi/chat/src/store'
import { User } from '@holi/core/domain/shared/types'

interface Props {
  message: ChatRoomMessage
  roomId: string
  holiUser?: User
  showAvatar?: boolean
  isPrevMessageFromSameUser?: boolean
  isNextMessageFromSameUser?: boolean
  testID?: string
}

const RoomMessage = ({ holiUser, message, roomId, ...props }: Props) => {
  const membersRecord = useAtomValue(useMemo(() => roomMembersAtomCreator(roomId), [roomId]))
  const member = membersRecord[message.sender ?? '']

  switch (message.type) {
    case 'message':
      return <RoomTextMessage member={member} holiUser={holiUser} message={message} {...props} />
    case 'membership':
      return <RoomMembershipBadge member={member} user={holiUser} message={message} />
  }
}

export default RoomMessage
