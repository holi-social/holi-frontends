import { ChatRoomAtom } from '@holi/chat/src/store'
import { User } from '@holi/core/domain/shared/types'

export interface RoomListProps {
  roomAtoms: ChatRoomAtom[]
  loggedInUser: User // optimization to not re-fetch the logged in user on scrolling
}
