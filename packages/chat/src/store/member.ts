import { produce } from 'immer'
import type { MatrixEvent, RoomMember, RoomState } from 'matrix-js-sdk'

import type { ChatRoomMember, MatrixId } from '@holi/chat/src/client/types'
import { getChatClient } from '@holi/chat/src/store/store'
import type { ChatRoom, ChatRoomAtom } from '@holi/chat/src/store/types'
import { chatServerName } from '@holi/core/helpers/config'
import type { User } from '@holi/core/screens/userprofile/types'

type HoliIdentity = string

/**
 * Converts a Matrix ID (e.g. `@otto:holi.social`) to a Holi identity (e.g. `otto`).
 */
export const toHoliIdentity = (matrixId: MatrixId): HoliIdentity =>
  matrixId.endsWith(`:${chatServerName}`) ? matrixId.substring(1, matrixId.indexOf(':')) : ''

/**
 * Converts a Holi identity (e.g. `otto`) to a Matrix ID (e.g. `@otto:holi.social`).
 */
const toMatrixIdentity = (holiIdentity: HoliIdentity): MatrixId => `@${holiIdentity}:${chatServerName}`

/**
 * A type guard that verifies if its a Matrix member ID (e.g. `@asap:holi.social`).
 */
export const isHoliMatrixIdentity = (id: string): id is MatrixId => /^@[a-z][a-z0-9_.-]*:.+$/.test(id)

export const ignoreUser = async (userId: string) => {
  await getChatClient().ignoreUser(userId)
}

export const ignoreUserAndLeaveRoom = async (userId: string) => {
  await getChatClient().ignoreUser(userId)
}

export const unignoreUser = async (userId: string) => {
  return await getChatClient().unignoreUser(userId)
}

export const getHoliUserForChatMember = (
  member: ChatRoomMember | undefined,
  userRecord: Record<MatrixId, User | undefined>
) => {
  if (!member) return

  return userRecord[member.id]
}

/**
 * Verifies if all the passed members (excluding the logged-in user) are ignored.
 */
export const hasOnlyIgnoredMembers = (members: ChatRoomMember[], ignoredUsers: MatrixId[]): boolean => {
  const ignoredRoomMembers = members.map((m) => m.id).filter((id) => ignoredUsers.includes(id))
  return ignoredRoomMembers.length === members.length - 1
}

export const getChatPartner = (loggedInUser: User, room: ChatRoom): ChatRoomMember | undefined => {
  // TODO this will have to be changed once we support multiple users per room
  return room.members.find((member) => member.id !== toMatrixIdentity(loggedInUser.identity))
}

export const isRoomCreator = (user: User, room: ChatRoom): boolean | undefined => {
  return room.creator ? room.creator.id === toMatrixIdentity(user.identity) : undefined
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
