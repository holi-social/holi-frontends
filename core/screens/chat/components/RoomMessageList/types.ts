import { ChatMessage } from '@holi/chat/src/store'
import { User } from '@holi/core/screens/userprofile/types'

export interface RoomMessageListProps {
  messages: ChatMessage[]
  mxIdUserRecord: Record<string, User>
}
