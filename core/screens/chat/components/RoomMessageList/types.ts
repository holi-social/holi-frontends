import React from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { ChatMessage } from '@holi/chat/src/store'
import { User } from '@holi/core/screens/userprofile/types'

export interface RoomMessageListProps {
  messages: ChatMessage[]
  matrixIdToHoliUserRecord: Record<string, User | undefined>
  starter?: React.ReactNode
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}
