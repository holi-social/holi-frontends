import { ChatRoomAtom } from '@holi/chat/src/store'
import { User } from '@holi/core/screens/userprofile/types'

export interface RoomListProps {
  roomAtoms: ChatRoomAtom[]
  loggedInUser: User // optimization to not re-fetch the logged in user on scrolling
}
