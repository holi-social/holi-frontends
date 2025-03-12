import type {
  ChatRoomMember,
  PrivateChatRoom,
  SpaceChildChatRoom,
  SpaceTaskChatRoom,
} from '@holi/chat/src/client/types'
import type { User } from '@holi/core/domain/shared/types'
import type { ChatRoomScreenProps } from '@holi/core/screens/chat/ChatRoomView/components/ChatRoomScreen'

interface BaseRoomViewProps extends Pick<ChatRoomScreenProps, 'messages' | 'matrixIdToHoliUserRecord'> {
  chatPartners: ChatRoomMember[]
  chatPartnerHoliUsers: User[]
}

export interface PrivateRoomViewProps extends BaseRoomViewProps {
  room: PrivateChatRoom
}

export interface SpaceTaskChatRoomProps extends BaseRoomViewProps {
  room: SpaceTaskChatRoom
}

export interface SpaceChildChatRoomProps extends BaseRoomViewProps {
  room: SpaceChildChatRoom
}
