import { produce } from 'immer'
import { Atom } from 'jotai'
import { EventTimeline, EventType, type IRoomEvent, type IStateEvent, Room, RoomMember } from 'matrix-js-sdk'

import {
  type ChatRoomMember,
  type MatrixId,
  MembershipStatus,
  RoomType,
  type RoomWithSharedData,
  type SpaceChildRoom,
  type SpaceRoom,
  type SpaceSharedDataContent,
} from '@holi/chat/src/client/types'
import { getLastMessageEvent, isIStateEvent } from '@holi/chat/src/client/utils'
import type {
  AtomRecordGetter,
  BaseChatRoom,
  ChatMembershipContent,
  ChatMessage,
  ChatMessageContent,
  ChatRoom,
  HoliIdentity,
  PrivateChatRoom,
  SpaceChatRoom,
  SpaceChildChatRoom,
} from '@holi/chat/src/store/types'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { chatServerName } from '@holi/core/helpers/config'

/**
 * Identity
 */

/**
 * Converts a Matrix ID (e.g. `@otto:holi.social`) to a Holi identity (e.g. `otto`).
 */
export const toHoliIdentity = (matrixId: MatrixId): HoliIdentity =>
  matrixId.endsWith(`:${chatServerName}`) ? matrixId.substring(1, matrixId.indexOf(':')) : ''

/**
 * Converts a Holi identity (e.g. `otto`) to a Matrix ID (e.g. `@otto:holi.social`).
 */
export const toMatrixIdentity = (holiIdentity: HoliIdentity): MatrixId => `@${holiIdentity}:${chatServerName}`

/**
 * A type guard that verifies if its a Matrix member ID (e.g. `@asap:holi.social`).
 */
export const isHoliMatrixIdentity = (id: string): id is MatrixId => /^@[a-z][a-z0-9_.-]*:.+$/.test(id)

/**
 * Rooms
 *
 */

export const getAtomFromRecordId = <T>(
  get: AtomRecordGetter,
  atomsRecordAtom: Atom<Record<string, T>>,
  roomId: string
): T | null => {
  const atomsRecord = get(atomsRecordAtom)
  const value = atomsRecord[roomId]
  if (!value) return null

  return value
}

export const hasSpaceContent = <T extends Record<keyof T, unknown>>(content: T | null): content is T =>
  content !== null && 'holiSpaceId' in content

export const isPrivateChatRoom = (room: ChatRoom): room is PrivateChatRoom => room.type === 'private'

export const isSpaceChatRoom = (room: ChatRoom): room is SpaceChatRoom => {
  return room.type === 'space' && hasSpaceContent<SpaceSharedDataContent>(room.content)
}

export const isSpaceChildChatRoom = (room: ChatRoom): room is SpaceChildChatRoom => {
  return room.type === 'space.child' && hasSpaceContent(room.content)
}

export const sortRoomByTimestamp = (roomA: ChatRoom, roomB: ChatRoom): number => {
  const timestampA = roomA.timestamp ?? Infinity
  const timestampB = roomB.timestamp ?? Infinity

  return timestampA < timestampB ? 1 : -1
}

/**
 * @description It returns one of the 3 (internal) chat rooms based
 * on the type of the RoomWithSharedData.
 * Types: `PrivateChatRoom`, `SpaceChatRoom`, `SpaceChildChatRoom`
 */
export const createChatRoom = (roomWithSharedData: RoomWithSharedData, hasInvitation = false): ChatRoom => {
  const baseChatRoom = createBaseChatRoom(roomWithSharedData.room, roomWithSharedData.type, hasInvitation)

  switch (roomWithSharedData.type) {
    case 'private':
      return createPrivateChatRoom(baseChatRoom)
    case 'space':
      return createSpaceChatRoom(baseChatRoom, roomWithSharedData)
    case 'space.child':
      return createSpaceChildChatRoom(baseChatRoom, roomWithSharedData)
    default:
      throw new HoliError('Unexpected ChatRoom: private, space and space.child supported')
  }
}

export function createPrivateChatRoom(baseChatRoom: BaseChatRoom): PrivateChatRoom {
  return {
    type: 'private',
    ...baseChatRoom,
  }
}

export function createSpaceChatRoom(baseChatRoom: BaseChatRoom, spaceRoom: SpaceRoom): SpaceChatRoom {
  return {
    type: 'space',
    content: {
      roomId: spaceRoom.content.roomId,
      holiSpaceId: spaceRoom.content.holiSpaceId,
    },
    ...baseChatRoom,
  }
}

export function createSpaceChildChatRoom(
  baseChatRoom: BaseChatRoom,
  spaceChildRoom: SpaceChildRoom
): SpaceChildChatRoom {
  return {
    type: 'space.child',
    content: {
      roomId: spaceChildRoom.content.roomId,
      holiSpaceId: spaceChildRoom.content.holiSpaceId,
      spaceName: spaceChildRoom.content.spaceName,
      avatarDefaultColor: spaceChildRoom.content.avatarDefaultColor,
      parentSpaceRoomId: spaceChildRoom.content.parentSpaceRoomId,
    },
    ...baseChatRoom,
  }
}

/**
 * @description It creates the base for all 3 (internal) types of chats rooms
 * `PrivateChatRoom`, `SpaceChatRoom`, `SpaceChildChatRoom`
 */
export function createBaseChatRoom(room: Room, roomType: RoomType, hasInvitation = false): BaseChatRoom {
  const lastMessageEvent = getLastMessageEvent(room, roomType)
  const lastMessage = lastMessageEvent && createChatMessage(room.roomId, lastMessageEvent)

  const roomMxCreatorId = room.getCreator()
  const roomMxCreator = roomMxCreatorId ? room.getMember(roomMxCreatorId) : null

  const avatar = room.getMxcAvatarUrl() ?? undefined

  return {
    id: room.roomId,
    name: room.name,
    avatar,
    notificationCount: room.getUnreadNotificationCount() + (hasInvitation ? 1 : 0),
    hasInvitation,
    lastMessage,
    creator: roomMxCreator && createChatMember(roomMxCreator),
    members: room.getMembers().map(createChatMember),
    timestamp:
      room.getLastActiveTimestamp() > 0
        ? room.getLastActiveTimestamp()
        : room.getLiveTimeline().getState(EventTimeline.FORWARDS)?.getStateEvents(EventType.RoomCreate, '')?.getTs(),
  }
}

const updateChatRoomNotificationCount = produce((chatRoom: ChatRoom, notificationCount: number) => {
  chatRoom.notificationCount = notificationCount
})

export function updateSpaceRoomsNotifications(chatRooms: ChatRoom[], spaceIdToChildIds: Record<string, string[]>) {
  return chatRooms.map((room) => {
    if (!isSpaceChatRoom(room)) return room
    if (!spaceIdToChildIds[room.id]) return room
    let totalNotificationCount: number = room.notificationCount

    for (const childId of spaceIdToChildIds[room.id]) {
      const childRoom = chatRooms.find((room) => room.id === childId)
      if (!childRoom) continue
      if (!isSpaceChildChatRoom(childRoom)) continue

      totalNotificationCount += childRoom.notificationCount
    }

    return updateChatRoomNotificationCount(room, totalNotificationCount)
  })
}

/**
 * Messages
 *
 */
export function createChatMessage(roomId: string, event: IRoomEvent | IStateEvent): ChatMessage {
  const base = {
    id: event.event_id,
    timestamp: event.origin_server_ts,
    room_id: roomId,
  }

  switch (event.type) {
    case EventType.RoomMessage:
      return {
        ...base,
        type: 'message',
        content: event.content as ChatMessageContent, // TODO: Fix cast
        sender: event.sender,
      }
    case EventType.RoomMember:
      return {
        ...base,
        type: 'membership',
        content: event.content as ChatMembershipContent, // TODO: Fix cast
        sender: isIStateEvent(event) ? event.state_key : event.sender,
      }

    default:
      throw new HoliError('Unexpected RoomEvent: only EventType.RoomMessage and EventType.RoomMember are supported')
  }
}

/**
 * Members
 */

export function createChatMember(roomMember: RoomMember): ChatRoomMember {
  const { userId, name, membership } = roomMember
  const id = userId as MatrixId
  return {
    id,
    name,
    avatar: roomMember.user?.avatarUrl,
    membership: getChatMembership(membership),
  }
}

export function getChatMembership(membership?: string) {
  switch (membership) {
    case 'join':
      return MembershipStatus.Joined
    case 'invite':
      return MembershipStatus.Invited
    case 'leave':
      return MembershipStatus.Left
  }
}

/**
 * Selectors
 */
export const roomContentSelector = (room: SpaceChildChatRoom) => room.content
