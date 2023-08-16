import { produce } from 'immer'
import type { MatrixEvent, RoomMember, RoomState } from 'matrix-js-sdk'

import type { ChatRoomAtom } from '@holi/chat/src/store/types'

export interface MemberEventOptions {
  event: MatrixEvent
  roomState: RoomState
  member: RoomMember
}

export const leaveRoomUpdate = produce((roomAtomsRecord: Record<string, ChatRoomAtom>, options: MemberEventOptions) => {
  const { event, roomState, member } = options

  if (member.membership !== 'leave') return
  if (event.getSender() !== member.userId) return

  delete roomAtomsRecord[roomState.roomId]
})

export const isLastMemberCreator = (roomState: RoomState, member: RoomMember) => {
  const members = roomState.getMembers()
  const isCreator = members.find((m) => m.powerLevel === 100)

  return member.membership === 'leave' && isCreator?.userId !== member.userId && members.length <= 2
}
