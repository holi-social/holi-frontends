import React from 'react'

import RoomMembershipBadge from '@holi/chat/src/components/RoomMessageList/RoomMembershipBadge'
import RoomTextMessage from '@holi/chat/src/components/RoomMessageList/RoomTextMessage'
import { ChatMessage } from '@holi/chat/src/store'
import { User } from '@holi/core/screens/userprofile/types'

interface RoomMessageProps {
  message: ChatMessage
  user?: User
  showAvatar?: boolean
  isPrevMessageFromSameUser?: boolean
  isNextMessageFromSameUser?: boolean
  testID?: string
}

const RoomMessage = ({ user, message, ...props }: RoomMessageProps) => {
  switch (message.type) {
    case 'message':
      return <RoomTextMessage user={user} message={message} {...props} />
    case 'membership':
      return <RoomMembershipBadge user={user} message={message} />
  }
}

export default RoomMessage
