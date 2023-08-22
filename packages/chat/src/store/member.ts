import { produce } from 'immer'
import type { MatrixEvent, RoomMember, RoomState } from 'matrix-js-sdk'

import { getChatClient } from '@holi/chat/src/store/store'
import type { ChatRoomAtom } from '@holi/chat/src/store/types'

export const ignoreUser = async (userId: string) => {
  await getChatClient().ignoreUser(userId)
}

export const ignoreUserAndLeaveRoom = async (userId: string) => {
  await getChatClient().ignoreUser(userId)
}

export const unignoreUser = async (userId: string) => {
  return await getChatClient().unignoreUser(userId)
}

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
  const creator = members.find((m) => m.powerLevel === 100)

  return member.membership === 'leave' && creator?.userId !== member.userId && members.length <= 2
}
