import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { ChatMessage } from '@holi/chat/src/store'
import { User } from '@holi/core/screens/userprofile/types'

export interface RoomMessageListProps {
  messages: ChatMessage[]
  mxIdUserRecord: Record<string, User>
  starter?: React.ReactNode
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}
